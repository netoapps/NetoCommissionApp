import React from 'react'
import LoadSpinner from 'react-loader'
import { strings } from '../../constants/strings'
import Table from './../common/table.jsx'
import Dropdown from '../../../../../node_modules/muicss/lib/react/dropdown'
import DropdownItem from '../../../../../node_modules/muicss/lib/react/dropdown-item'
import Button from '../../../../../node_modules/muicss/lib/react/button'
import Dropzone from 'react-dropzone'
import {CommissionFile} from '../../model/commission-file.js';
import AppStore from '../../stores/data-store'
import MonthYearBox from './../common/month-year-box.jsx'
import {getMonthName,getMonthNumber} from './../common/month-year-box.jsx'
import AppActions from '../../actions/app-actions'
import DataService from '../../services/data-service.js';
import {ActionType} from '../../actions/app-actions.js'
import ExcelService from '../../services/excel-service.js'
import {Modal} from '../common/app-modal.jsx';

var notSetValue = "לא נקבע"
var agentNumberValue = "מספר סוכן"
var portfolioValue = "גודל תיק"
class ColumnSelectModalContentCell extends React.Component
{
    constructor(props)
    {
        super(props);

        this.state = {
            types: this.props.types,
            selectedType: this.props.selectedType
        }
    }
    componentWillReceiveProps(nextProps)
    {
        this.state.types = nextProps.types
        this.state.selectedType = nextProps.selectedType
        this.setState(this.state)
    }
    onTypeChange(item)
    {
        if(item != this.state.selectedType)
        {
            this.state.selectedType = item
            this.setState(this.state)
            this.props.onSelectType(this.state.selectedType,this.props.value)
        }
    }

    render() {

        var types = []
        var className = "columns-select-cell-value"
        var color = "default"
        if(this.state.selectedType != notSetValue)
        {
            //className += " columns-select-cell-value-selected"
            color = "primary"
        }
        for(var type = 0; type < this.state.types.length; type++)
        {
            types.push(<DropdownItem className="mui--text-right" onClick={this.onTypeChange.bind(this,this.state.types[type])} value={this.state.types[type]} key={type}>{this.state.types[type]}</DropdownItem>)
        }

        return <div className="columns-select-cell">
                 <div className={className}>{this.props.value}</div>
                 <div className="columns-select-cell-options">
                     <Dropdown label={this.state.selectedType} alignMenu="right" color={color} variant="raised">
                         {types}
                     </Dropdown>
                 </div>
        </div>
    }
}

class ColumnSelectModalContent extends React.Component
{
    constructor(props) {
        super(props);

        var types = AppStore.getCommissionTypes().slice()
        types = types.concat(portfolioValue).concat(agentNumberValue).concat(notSetValue)

        var typeSelection = {}
        for(var type = 0; type < types.length; type++)
        {
            typeSelection[types[type]] = null
        }

        this.state = {
            types: types,
            typeSelection: typeSelection,
            columnToClear: null
        }
    }
    onSelectType(type,columnName)
    {
        if(type === notSetValue)
        {
            var typeOfColumn = this.selectedTypeOfColumn(columnName)
            if(typeOfColumn != notSetValue)
            {
                this.state.columnToClear = columnName
            }
            this.state.typeSelection[typeOfColumn] = null
        }
        //Clearing other column by settings this one
        else
        {
            this.state.columnToClear = this.state.typeSelection[type]
            this.state.typeSelection[type] = columnName
        }
        this.setState(this.state)

    }
    validateColumnSettings(callback)
    {
        var agentNumberNotSet = false
        var notSetTypes = []
        var commissionTypes = AppStore.getCommissionTypes().slice()
        var indexOfType = -1

        for(var type = 0; type < this.state.types.length; type++)
        {
            if(this.state.types[type] != notSetValue)
            {
                var typeValue = this.state.types[type]
                if (this.state.typeSelection[typeValue] == null)
                {
                    if(typeValue == agentNumberValue)
                    {
                        agentNumberNotSet = true
                        break
                    }
                    else if ((indexOfType = commissionTypes.indexOf(typeValue)) != -1)
                    {
                        //remove it (mark as not set)
                        commissionTypes.splice(indexOfType, 1)
                    }
                    notSetTypes.push(typeValue)
                }
            }
        }
        if(agentNumberNotSet)
        {
            swal({
                title: "שגיאה",
                text:  "חובה לבחור עמודה עבור 'מספר סוכן'",
                type: "error",
                showCancelButton: false,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "סגור",
                closeOnConfirm: true,
                showLoaderOnConfirm: false
            });
            callback(false)
        }
        else if(commissionTypes.length == 0)
        {
            var comTypes = AppStore.getCommissionTypes()
            var comTypesStr = ""
            for(var comTypeIndex = 0; comTypeIndex < comTypes.length ; comTypeIndex++)
            {
                comTypesStr += "'"+comTypes[comTypeIndex]+"'"
                comTypesStr += " "
            }
            swal({
                title: "שגיאה",
                text:  "חובה לבחור לפחות אחד מסוגי העמלות " + comTypesStr,
                type: "error",
                showCancelButton: false,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "סגור",
                closeOnConfirm: true,
                showLoaderOnConfirm: false
            });
            callback(false)
        }
        else if(notSetTypes.length)
        {
            var missingType = ""
            for(var missingIndex = 0;  missingIndex < notSetTypes.length; missingIndex++)
            {
                missingType += "'"+notSetTypes[missingIndex]+"'"
                missingType += " "
            }
            swal({
                title: "הערה",
                text:  "לא נבחרה עמודה עבור "+ missingType + ", להמשיך?",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "המשך",
                cancelButtonText: "ביטול",
                closeOnConfirm: true,
                closeOnCancel: true
            },
            function(isConfirm)
            {
                if (!isConfirm)
                {
                    callback(false)
                    return
                }
                callback(true)
            });
        }
        else
        {
            callback(true)
        }
    }
    onCancel()
    {
        this.props.onCancel()
        Modal.hide()
    }
    onSave()
    {
        this.validateColumnSettings(((result) => {
            if(result)
            {
                delete this.state.typeSelection[notSetValue]
                this.props.onSave(this.state.typeSelection)
                Modal.hide()
            }
        }).bind(this))
    }
    selectedTypeOfColumn(column)
    {
        for(var key in this.state.typeSelection)
        {
            if(this.state.typeSelection[key] === column)
            {
                return key
            }
        }
        return notSetValue
    }
    render()
    {
        var columns = []
        var modalTitle = "בחר עמודות"
        for(var col = 0; col < this.props.columns.length;  col++)
        {
            var selectedType = this.selectedTypeOfColumn(this.props.columns[col])
            if(this.props.columns[col] == this.state.columnToClear)
            {
                selectedType = notSetValue
                this.state.columnToClear = null
            }
            columns.push(<ColumnSelectModalContentCell selectedType={selectedType} onSelectType={this.onSelectType.bind(this)} types={this.state.types} key={col} value={this.props.columns[col]}/>)
        }

        return <div className="columns-select-modal">
            <div className="modal-title">{modalTitle}</div>
            <div className="columns-select-container hcontainer-no-wrap">
                {columns}
            </div>
            <div className="hcontainer-no-wrap">
                <div className="horizontal-spacer-90"/>
                <Button className="shadow" onClick={this.onCancel.bind(this)} color="default">{strings.cancel}</Button>
                <div className="horizontal-spacer-20"/>
                <Button className="shadow" onClick={this.onSave.bind(this)} color="primary">{strings.save}</Button>
            </div>
            <div className="vertical-spacer-20"/>
            <div className="vertical-spacer-20"/>
        </div>
    }
}

class FileBin extends React.Component {

    constructor(props) {
        super(props);

        var commissionFile = new CommissionFile()
        commissionFile.paymentDate = new Date(commissionFile.paymentDate.getFullYear(), commissionFile.paymentDate.getMonth(), 1, 0, 0, 0, 0);
        this.state = {
            commissionFile: commissionFile,
            draggedFile: null,
            columnSettings: null,
            dataLoaded: true
        };

        this._handleUploadCompleted = this.handleUploadCompleted.bind(this)

    }
    componentDidMount()
    {
        AppStore.addEventListener(ActionType.UPLOAD_COMMISSION_FILE_COMPLETED, this._handleUploadCompleted);
    }

    componentWillUnmount()
    {
        AppStore.removeEventListener(ActionType.UPLOAD_COMMISSION_FILE_COMPLETED,this._handleUploadCompleted);
    }
    handleUploadCompleted()
    {
        this.reset()
    }
    reset()
    {
        this.state.commissionFile = new CommissionFile()
        this.state.draggedFile = null
        this.state.columnSettings = null
        this.setState(this.state)
    }
    onCompanyNameChange(item)
    {
        if(item != this.state.commissionFile.company)
        {
            this.state.commissionFile.company = item
            this.setState(this.state);
        }
    }

    onMonthChange(month)
    {
        this.state.commissionFile.paymentDate = new Date(this.state.commissionFile.paymentDate.getFullYear(), getMonthNumber(month), 1, 0, 0, 0, 0);
        this.setState(this.state)

    }
    onYearChange(year)
    {
        this.state.commissionFile.paymentDate = new Date(year, this.state.commissionFile.paymentDate.getMonth(), 1, 0, 0, 0, 0);
        this.setState(this.state)
    }
    onSaveColumnSettings(settings)
    {
        this.state.columnSettings = settings
        this.setState(this.state)
    }
    onCancelColumnSettings()
    {
        this.reset()
    }
    onDrop(files)
    {
        console.log('Received files: ', files)
        this.state.draggedFile = files[0]
        this.state.commissionFile.name = files[0].name
        this.state.commissionFile.uploadDate = new Date();
        this.state.dataLoaded = false;
        this.setState(this.state)

        DataService.parseExcelColumns(this.state.draggedFile,(response) => {

            this.state.dataLoaded = true;
            this.setState(this.state)

            if(response.result)
            {
                this.state.commissionFile.dataRowNumber = response.dataRowNumber
                Modal.showWithContent(<ColumnSelectModalContent columns={response.headers} onSave={this.onSaveColumnSettings.bind(this)} onCancel={this.onCancelColumnSettings.bind(this)}/>)
            }
            else
            {
                swal({
                    title: "שגיאה",
                    text: "שגיאה בעת קריאת הקובץ",
                    type: "error",
                    showCancelButton: false,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "סגור",
                    closeOnConfirm: true,
                    showLoaderOnConfirm: false
                });
                this.reset()
            }
        })
    }
    isValidInput()
    {
        if(this.state.commissionFile.name.length == 0)
        {
            swal({
                title: "שגיאה",
                text: "לא הועלה קובץ",
                type: "error",
                showCancelButton: false,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "סגור",
                closeOnConfirm: true,
                showLoaderOnConfirm: false
            });
            return false
        }
        if(this.state.commissionFile.company.length == 0)
        {
            swal({
                title: "שגיאה",
                text: "קובץ לא משוייך לחברה",
                type: "error",
                showCancelButton: false,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "סגור",
                closeOnConfirm: true,
                showLoaderOnConfirm: false
            });
            return false
        }
        if(this.state.commissionFile.taxState === strings.taxNotIncluded)
        {
            if(this.state.commissionFile.taxValue.length == 0)
            {
                swal({
                    title: "שגיאה",
                    text: "לא הוזן מע״מ",
                    type: "error",
                    showCancelButton: false,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "סגור",
                    closeOnConfirm: true,
                    showLoaderOnConfirm: false
                });
                return false
            }
            else if (isNaN(parseFloat(this.state.commissionFile.taxValue)))
            {
                swal({
                        title: "שגיאה",
                        text: "מע״מ לא חוקי",
                        type: "error",
                        showCancelButton: false,
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "סגור",
                        closeOnConfirm: true,
                        showLoaderOnConfirm: false
                    });
                return false
            }
        }
        return true
    }
    onUploadFile()
    {
        if(!this.isValidInput())
        {
            return
        }
        this.state.dataLoaded = false
        this.setState(this.state);
        this.state.commissionFile.columnSettings = this.state.columnSettings
        AppActions.uploadCommissionFile(this.state.commissionFile,this.state.draggedFile, function (response) {
           if(response.result)
           {
                 swal(
                    {
                        title: "",
                        text: "קובץ נשמר בשרת",
                        type: "success",
                        timer: 1500,
                        showConfirmButton: false
                    })
            }
            else
            {
                var title = "שגיאה"
                var message = ""
                switch(response.errCode)
                {
                    case 13:
                        message = "קובץ אינו קיים במערכת"
                        break
                    case 11:
                        message = "קובץ כבר קיים במערכת"
                        break
                    case 34:
                        message = "הקובץ מכיל מספרי סוכן שאינם קיימים במערכת:"
                        message += "\n\n"
                        var agentNumbers = ""
                        for(var index = 0; index < response.errData.length; index++)
                        {
                            agentNumbers +=  response.errData[index] + (((index+1) == response.errData.length) ? "":", ")
                        }
                        message += agentNumbers
                        break
                }
                swal({
                    title: title,
                    text: message,
                    type: "error",
                    showCancelButton: false,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "סגור",
                    closeOnConfirm: true,
                    showLoaderOnConfirm: false
                });
            }
            //if success
            this.state.dataLoaded = true
            this.state.commissionFile = new CommissionFile()
            this.setState(this.state);

        }.bind(this))
    }

    onEditFiles()
    {
        this.context.router.push('/app/commissions/edit-files')
    }

    onFileNoteBlur(e)
    {
        this.state.commissionFile.note = e.target.value
        this.setState(this.state);
    }
    onFileTaxBlur(e)
    {
        this.state.commissionFile.taxValue = e.target.value
        this.setState(this.state);
    }
    onTaxOptionChange(item)
    {
        if(item != this.state.taxState)
        {
            this.state.commissionFile.taxState = item
            this.setState(this.state);
        }
    }
    onFileTaxValueChange(e)
    {
        this.state.commissionFile.taxValue = e.target.value
        this.setState(this.state);
    }
    onFileNoteChange(e)
    {
        this.state.commissionFile.note = e.target.value
        this.setState(this.state);
    }
    render () {

        const companies = [];
        const companyNames = AppStore.getCompanies()
        for (let i = 0; i < companyNames.length; i++ )
        {
            companies.push(<DropdownItem className="mui--text-right" onClick={this.onCompanyNameChange.bind(this,companyNames[i])} value={companyNames[i]} key={i}>{companyNames[i]}</DropdownItem>);
        }
        const taxStateOptions = [];
        taxStateOptions.push(<DropdownItem className="mui--text-right" onClick={this.onTaxOptionChange.bind(this,strings.taxIncluded)} value={strings.taxIncluded} key={0}>{strings.taxIncluded}</DropdownItem>);
        taxStateOptions.push(<DropdownItem className="mui--text-right" onClick={this.onTaxOptionChange.bind(this,strings.taxNotIncluded)} value={strings.taxNotIncluded} key={1}>{strings.taxNotIncluded}</DropdownItem>);

        let style = {
            backgroundColor: 'transparent',
            color: '#505050'
        };

        let activeStyle = {
            backgroundColor: 'rgba(66, 134, 180, 0.15)'
        };

        var fileTaxInput = null
        if(this.state.commissionFile.taxState === strings.taxNotIncluded)
        {
            fileTaxInput = <div className="commissions-page-file-bin-settings-tax-input-container">
                                <textarea className="commissions-page-file-bin-settings-tax-input"
                                          value={this.state.commissionFile.taxValue}
                                          onChange={this.onFileTaxValueChange.bind(this)}
                                          onBlur={this.onFileTaxBlur.bind(this)}/><div className="commissions-page-file-bin-settings-text">%</div>
                           </div>
        }

        var dragAreaString = strings.dragFileHere
        if(this.state.commissionFile.name.length > 0)
        {
            dragAreaString = this.state.commissionFile.name
        }

        var month = getMonthName(this.state.commissionFile.paymentDate.getMonth())
        var year = this.state.commissionFile.paymentDate.getFullYear().toString()

        var uploadFileButtonDisabled = true
        if(this.state.commissionFile.name.length > 0)
        {
            uploadFileButtonDisabled = false
        }

        return <div className="commissions-page-file-bin shadow">
            <LoadSpinner loadedClassName="load-spinner"  top={'115px'}  loaded={this.state.dataLoaded}>
                <div>
                    <Dropzone onDrop={this.onDrop.bind(this)} className="commissions-page-file-bin-drag-area" style={style} activeStyle={activeStyle}>
                        <strong>{dragAreaString}</strong>
                    </Dropzone>
                    <div className="commissions-page-file-bin-settings">

                        <div className="hcontainer-no-wrap">
                            <div className="commissions-page-file-bin-settings-text">{strings.companyAssignment}</div>
                            <Dropdown label={this.state.commissionFile.company} alignMenu="right" variant="raised">
                                {companies}
                            </Dropdown>
                            <div className="horizontal-spacer-10"/>
                            <div className="horizontal-spacer-10"/>
                            <div className="horizontal-spacer-10"/>
                            <div className="commissions-page-file-bin-settings-text">{strings.paymentMonth}</div>
                            <MonthYearBox month={month} year={year} onMonthChange={this.onMonthChange.bind(this)} onYearChange={this.onYearChange.bind(this)}/>
                            <div className="horizontal-spacer-10"/>
                            <div className="commissions-page-file-bin-settings-text">{strings.tax}</div>
                            <Dropdown label={this.state.commissionFile.taxState} alignMenu="right" variant="raised">
                                {taxStateOptions}
                            </Dropdown>
                            <div className="horizontal-spacer-10"/>
                            {fileTaxInput}
                        </div>
                        <div className="hcontainer-no-wrap left-align">
                            <Button className="shadow" onClick={this.onEditFiles.bind(this)}>{strings.editFiles}</Button>
                            <div className="horizontal-spacer-10"/>
                            <div className="horizontal-spacer-10"/>
                            <Button className="shadow" onClick={this.onUploadFile.bind(this)} color="primary" disabled={uploadFileButtonDisabled}>{strings.uploadFile}</Button>
                            <div className="commissions-page-file-note-container">
                                <div className="commissions-page-file-bin-settings-text">{strings.notes}</div>
                                <textarea className="commissions-page-file-note"
                                          value={this.state.commissionFile.notes}
                                          onChange={this.onFileNoteChange.bind(this)}
                                          onBlur={this.onFileNoteBlur.bind(this)}/>
                            </div>
                        </div>
                    </div>
                </div>
                </LoadSpinner>
             </div>;
    }
}

//Important!! This adds the router object to context
FileBin.contextTypes = {
    router: React.PropTypes.object.isRequired
}


class Commissions extends React.Component {

    constructor(props) {
        super(props);

        var date = new Date()
        var currentMonth = getMonthName(date.getMonth().toString());
        var currentYear = date.getFullYear().toString();
        var monthStartDate = new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0);

        this.state = {
            commissions: [],
            dataLoaded: false,
            date: monthStartDate,
            selectedMonth: currentMonth,
            selectedYear:currentYear,

        };
        this._handleUploadCompleted = this.handleUploadCompleted.bind(this)
    }

    componentWillUnmount()
    {
        AppStore.removeEventListener(ActionType.UPLOAD_COMMISSION_FILE_COMPLETED,this._handleUploadCompleted);
    }
    componentDidMount()
    {
        AppStore.addEventListener(ActionType.UPLOAD_COMMISSION_FILE_COMPLETED, this._handleUploadCompleted);
        this.reloadDataWithDate(this.state.date)
    }
    reloadDataWithDate(date)
    {
        this.state.commissions = []
        this.state.dataLoaded = false
        this.state.date = date
        this.setState(this.state)

        this.reloadData( (data)  => {
            this.state.commissions = data
            this.state.dataLoaded = true
            this.setState(this.state)
        })
    }
    reloadData(callback)
    {
        DataService.loadAllCompanyPaymentTypesForMonth(this.state.date,  (response) => {
            var data = []
            if(response.result == true)
            {
                for (const item of response.data)
                {
                    var name = ""
                    if(item.owner === "partnership")
                    {
                        var partnership = AppStore.getPartnership(item.idNumber)
                        if(partnership != null)
                        {
                            for(var idIndex = 0; idIndex < partnership.agentsDetails.length ; idIndex++)
                            {
                                var agentData = AppStore.getAgent(partnership.agentsDetails[idIndex].idNumber)
                                if(agentData != null)
                                {
                                    name += agentData.name + " " + agentData.familyName
                                    if(idIndex < (partnership.agentsDetails.length-1))
                                    {
                                         name += ", "
                                    }
                                }
                            }
                        }
                    }
                    else
                    {
                        var agent = AppStore.getAgent(item.idNumber)
                        if (agent != null)
                        {
                            name = agent.name + " " + agent.familyName
                        }
                        else
                        {
                            name = "סוכן לא קיים"
                        }
                    }

                    data.unshift({companyName: item.company,
                        paymentType: item.type,
                        agentNumber: item.agentInCompanyId,
                        agentName: name,
                        totalPayment: item.amount,
                        totalInvestments: item.portfolio,
                        paymentDate: item.paymentDate,
                        creationTime: item.creationTime
                    })
                }
            }
            else
            {
                this.logger.error("Error while loading commission files entries");
            }
            callback(data)
        })
    }
    handleUploadCompleted()
    {
        this.reloadDataWithDate(this.state.date)
    }

    onMonthChange(month)
    {
        if(month != this.state.selectedMonth)
        {
            this.state.selectedMonth = month;
            this.state.date = new Date(this.state.date.getFullYear(), getMonthNumber(month), 1, 0, 0, 0, 0);
            this.reloadDataWithDate(this.state.date)
        }
    }
    onYearChange(year)
    {
        if(year != this.state.selectedYear)
        {
            this.state.selectedYear = year;
            this.state.date = new Date(year, this.state.date.getMonth(), 1, 0, 0, 0, 0);
            this.reloadDataWithDate(this.state.date)
        }
    }
    render () {

        var columns = [
            {
                title: "חברה",
                key: "companyName",
                width: "20%",
                type: 'read-only',
                color: 'normal',
                searchBox: true
            },
            {
                title: "מספר סוכן",
                key: "agentNumber",
                width: "10%",
                type: 'read-only',
                color: 'normal',
                searchBox: true
            },
            {
                title: "שם סוכן",
                key: "agentName",
                width: "20%",
                type: 'read-only',
                color: 'normal',
                searchBox: true
            },
            {
                title: "סוג תשלום",
                key: "paymentType",
                width: "10%",
                type: 'read-only',
                color: 'normal',
                searchBox: true
            },
            {
                title: "סה״כ תשלום",
                key: "totalPayment",
                width: "10%",
                type: 'read-only',
                format: 'currency',
                color: 'normal',
                searchBox: true
            },
            {
                title: "סה״כ גודל תיק",
                key: "totalInvestments",
                width: "10%",
                type: 'read-only',
                format: 'currency',
                color: 'normal',
                searchBox: true
            },
            {
                title: "חודש שכר",
                key: "paymentDate",
                width: "10%",
                type: 'month-year-date',
                color: 'normal',
                searchBox: true
            },
            {
                title: "תאריך העלאה",
                key: "creationTime",
                width: "10%",
                type: 'full-date',
                color: 'normal',
                searchBox: true
            }

        ]


        return (
            <div className="commissions-page animated fadeIn">


                <FileBin />

                <div className="vertical-spacer-30"/>
                <div className="hcontainer-no-wrap">
                    <MonthYearBox month={this.state.selectedMonth} year={this.state.selectedYear}
                                  onMonthChange={this.onMonthChange.bind(this)}
                                  onYearChange={this.onYearChange.bind(this)}/>
                </div>

                <div className="commissions-page-table shadow">
                    <LoadSpinner loadedClassName="load-spinner" top={'60%'} loaded={this.state.dataLoaded}>
                        <Table heightClass="commissions-page-table-height"
                               columns={columns}
                               data={this.state.commissions}/>
                    </LoadSpinner>
                </div>
            </div>
        );
    }
}

//Important!! This adds the router object to context
Commissions.contextTypes = {
    router: React.PropTypes.object.isRequired
}



export default Commissions;