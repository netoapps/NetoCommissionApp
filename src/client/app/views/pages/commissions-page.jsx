import React from 'react'
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
import CommisssionFileParser from '../../services/commission-file-parser.js'
import {Modal} from '../common/app-modal.jsx';

var notSetValue = "לא נקבע"
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
        if(item.props.value != this.state.selectedType)
        {
            this.state.selectedType = item.props.value
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
            types.push(<DropdownItem onClick={this.onTypeChange.bind(this)} value={this.state.types[type]} key={type}>{this.state.types[type]}</DropdownItem>)
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

        var types = AppStore.getCommissionTypes().concat("גודל תיק").concat("מספר סוכן").concat(notSetValue)
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
        //If setting an already selected column with not set value (= clearing a column)
        if(type == notSetValue && this.selectedTypeOfColumn(columnName) != notSetValue)
        {
            this.state.columnToClear = columnName
        }
        //Clearing other column by settings this one
        else if(this.state.typeSelection[type] != null)
        {
            this.state.columnToClear = this.state.typeSelection[type]
        }
        if(type != notSetValue)
        {
            this.state.typeSelection[type] = columnName
        }
        this.setState(this.state)

        for(var key in this.state.typeSelection)
        {
            console.log(key + " = " + this.state.typeSelection[key])
        }
    }
    validateColumnSettings()
    {
        var notSet = false
        var notSetTypeName = ""
        for(var type = 0; type < this.state.types.length; type++)
        {
            if(this.state.types[type] != notSetValue)
            {
                var commissionType = this.state.types[type]
                if (this.state.typeSelection[commissionType] == null) {
                    notSet = true
                    notSetTypeName = commissionType
                    break
                }
                else if (this.state.typeSelection[commissionType].length == 0)
                {
                    notSet = true
                    notSetTypeName = commissionType
                    break
                }
            }
        }
        if(notSet)
        {
            swal({
                title: "שגיאה",
                text:  "לא נבחרה עמודה עבור '"+ notSetTypeName + "'",
                type: "error",
                showCancelButton: false,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "סגור",
                closeOnConfirm: true,
                showLoaderOnConfirm: false
            });
            return false
        }
        return true
    }
    onCancel()
    {
        this.props.onCancel()
        Modal.hide()
    }
    onSave()
    {
        if(this.validateColumnSettings())
        {
            delete this.state.typeSelection[notSetValue]
            this.props.onSave(this.state.typeSelection)
            Modal.hide()
        }
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
            columnSettings: null
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
        if(item.props.value != this.state.commissionFile.company)
        {
            this.state.commissionFile.company = item.props.value
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
        this.setState(this.state)

        CommisssionFileParser.parseCommissionFile(this.state.draggedFile, ((result) => {

            if(result.success)
            {
                Modal.showWithContent(<ColumnSelectModalContent columns={result.columns} onSave={this.onSaveColumnSettings.bind(this)} onCancel={this.onCancelColumnSettings.bind(this)}/>)
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
        }).bind(this))
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

        AppActions.uploadCommissionFile(this.state.commissionFile,this.state.draggedFile,this.state.columnSettings, function (response) {
           if(response.result)
            {
                //if success
                this.state.commissionFile = new CommissionFile()
                this.setState(this.state);
                swal(
                    {
                        title: "",
                        text: "קובץ נשמר בשרת",
                        type: "success",
                        timer: 1500,
                        showConfirmButton: false
                    }
                )
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
        if(item.props.value != this.state.taxState)
        {
            this.state.commissionFile.taxState = item.props.value
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
            companies.push(<DropdownItem onClick={this.onCompanyNameChange.bind(this)} value={companyNames[i]} key={i}>{companyNames[i]}</DropdownItem>);
        }
        const taxStateOptions = [];
        taxStateOptions.push(<DropdownItem onClick={this.onTaxOptionChange.bind(this)} value={strings.taxIncluded} key={0}>{strings.taxIncluded}</DropdownItem>);
        taxStateOptions.push(<DropdownItem onClick={this.onTaxOptionChange.bind(this)} value={strings.taxNotIncluded} key={1}>{strings.taxNotIncluded}</DropdownItem>);

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

        return  <div className="commissions-page-file-bin shadow">
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
        ;
    }
}

//Important!! This adds the router object to context
FileBin.contextTypes = {
    router: React.PropTypes.object.isRequired
}


class Commissions extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            commissions: []
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

        this.reloadData( (data)  => {
            this.state.commissions = data
            this.setState(this.state)
        })
    }

    reloadData(callback)
    {
        DataService.loadAllCommissionFilesEntries( (response) => {
            var data = []
            if(response.result == true)
            {
                for (const item of response.data)
                {
                    var agent = AppStore.getAgent(item.idNumber)
                    var agentName = ""
                    if (agent != null)
                    {
                        agentName = agent.name + " " + agent.familyName
                    }
                    var agentName = agent.name + " " + agent.familyName
                    data.push({companyName: item.company,
                        paymentType: item.type,
                        agentNumber: item.agentInCompanyId,
                        agentName: agentName,
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
        this.reloadData( (data)  => {
            this.state.commissions = data
            this.setState(this.state)
        })
    }
    render () {

        var columns = [

            {
                title: "חברה",
                key: "companyName",
                width: "col-33-33",
                type: 'read-only',
                color: 'normal'
            },
            {
                title: "מספר סוכן",
                key: "agentNumber",
                width: "col-33-33",
                type: 'read-only',
                color: 'normal'
            },
            {
                title: "שם סוכן",
                key: "agentName",
                width: "col-33-33",
                type: 'read-only',
                color: 'normal'
            },
            {
                title: "סוג תשלום",
                key: "paymentType",
                width: "col-33-33",
                type: 'read-only',
                color: 'normal'
            },
            {
                title: "סה״כ תשלום",
                key: "totalPayment",
                width: "col-33-33",
                type: 'read-only',
                format: 'currency',
                color: 'normal'
            },
            {
                title: "סה״כ גודל תיק",
                key: "totalInvestments",
                width: "col-33-33",
                type: 'read-only',
                format: 'currency',
                color: 'normal'
            },
            {
                title: "חודש שכר",
                key: "paymentDate",
                width: "col-33-33",
                type: 'month-year-date',
                color: 'normal'
            },
            {
                title: "תאריך העלאה",
                key: "creationTime",
                width: "col-33-33",
                type: 'full-date',
                color: 'normal'
            }

        ]

        // var data = [
        //     {companyName: "מגדל", paymentType: "היקף", agentNumber: "2342234523", agentName: "קרין בוזלי לוי", totalPayment: "23423", totalInvestments: "12342232", paymentMonth: "04/16", date: "05/11/2016"},
        //     {companyName: "כלל", paymentType: "נפרעים", agentNumber: "234234", agentName: "עידן כץ", totalPayment: "2342", totalInvestments: "678646", paymentMonth: "אפריל", date: "05/11/2016"},
        //     {companyName: "אלטשולר שחם", paymentType: "בונוס", agentNumber: "67868", agentName: "לנצמן", totalPayment: "5675", totalInvestments: "34234535", paymentMonth: "אפריל", date: "05/11/2016"},
        //     {companyName: "מנורה", paymentType: "גמ״ח", agentNumber: "789565", agentName: "לירון בן ציון", totalPayment: "4562", totalInvestments: "78768657", paymentMonth: "אפריל", date: "05/11/2016"}
        //  ]


        return (
            <div className="commissions-page animated fadeIn">
                <FileBin />
                <div className="commissions-page-table shadow">
                     <Table columns={columns}
                            data={this.state.commissions}/>
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