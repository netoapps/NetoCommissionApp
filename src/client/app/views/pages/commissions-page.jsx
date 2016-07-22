import React from 'react'
import AuthService from '../../services/auth-service'
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

var moment = require('react-datepicker/node_modules/moment')


class FileBin extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            commissionFile: new CommissionFile()
        };

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
    onDrop(files)
    {
        console.log('Received files: ', files)
        this.state.commissionFile.draggedFile = files[0]
        this.state.commissionFile.name = files[0].name
        this.state.commissionFile.uploadDate = new Date();
        this.setState(this.state)
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
        AppActions.uploadCommissionFile(this.state.commissionFile
        )
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
                    <div className="dashboard-buttons-horizontal-spacer"/>
                    <div className="dashboard-buttons-horizontal-spacer"/>
                    <div className="dashboard-buttons-horizontal-spacer"/>
                    <div className="commissions-page-file-bin-settings-text">{strings.paymentMonth}</div>
                    <MonthYearBox month={month} year={year} onMonthChange={this.onMonthChange.bind(this)} onYearChange={this.onYearChange.bind(this)}/>
                    <div className="dashboard-buttons-horizontal-spacer"/>
                    <div className="commissions-page-file-bin-settings-text">{strings.tax}</div>
                    <Dropdown label={this.state.commissionFile.taxState} alignMenu="right" variant="raised">
                        {taxStateOptions}
                    </Dropdown>
                    <div className="dashboard-buttons-horizontal-spacer"/>
                    {fileTaxInput}
                </div>
                <div className="hcontainer-no-wrap left-align">
                    <Button className="shadow" onClick={this.onEditFiles.bind(this)}>{strings.editFiles}</Button>
                    <div className="dashboard-buttons-horizontal-spacer"/>
                    <div className="dashboard-buttons-horizontal-spacer"/>
                    <Button className="shadow" onClick={this.onUploadFile.bind(this)} color="primary">{strings.uploadFile}</Button>
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
            loginData: AuthService.getLoginData()
        };

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
                title: "סוג תשלום",
                key: "paymentType",
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
                key: "paymentMonth",
                width: "col-33-33",
                type: 'read-only',
                color: 'normal'
            },
            {
                title: "תאריך העלאה",
                key: "date",
                width: "col-33-33",
                type: 'read-only',
                color: 'normal'
            }

        ]

        var data = [
            {companyName: "מגדל", paymentType: "היקף", agentNumber: "2342234523", agentName: "קרין בוזלי לוי", totalPayment: "23423", totalInvestments: "12342232", paymentMonth: "04/16", date: "05/11/2016"},
            {companyName: "כלל", paymentType: "נפרעים", agentNumber: "234234", agentName: "עידן כץ", totalPayment: "2342", totalInvestments: "678646", paymentMonth: "אפריל", date: "05/11/2016"},
            {companyName: "אלטשולר שחם", paymentType: "בונוס", agentNumber: "67868", agentName: "לנצמן", totalPayment: "5675", totalInvestments: "34234535", paymentMonth: "אפריל", date: "05/11/2016"},
            {companyName: "מנורה", paymentType: "גמ״ח", agentNumber: "789565", agentName: "לירון בן ציון", totalPayment: "4562", totalInvestments: "78768657", paymentMonth: "אפריל", date: "05/11/2016"},
            {companyName: "ילין לפידות", paymentType: "היקף", agentNumber: "345654", agentName: "ויטלי", totalPayment: "6786", totalInvestments: "3453453", paymentMonth: "אפריל", date: "05/11/2016"},
            {companyName: "ילין לפידות", paymentType: "היקף", agentNumber: "345654", agentName: "ויטלי", totalPayment: "6786", totalInvestments: "3453453", paymentMonth: "אפריל", date: "05/11/2016"},
            {companyName: "כלל", paymentType: "נפרעים", agentNumber: "234234", agentName: "עידן כץ", totalPayment: "2342", totalInvestments: "678646", paymentMonth: "אפריל", date: "05/11/2016"},
            {companyName: "מנורה", paymentType: "גמ״ח", agentNumber: "789565", agentName: "לירון בן ציון", totalPayment: "4562", totalInvestments: "78768657", paymentMonth: "אפריל", date: "05/11/2016"},
            {companyName: "ילין לפידות", paymentType: "היקף", agentNumber: "345654", agentName: "ויטלי", totalPayment: "6786", totalInvestments: "3453453", paymentMonth: "אפריל", date: "05/11/2016"},
            {companyName: "כלל", paymentType: "נפרעים", agentNumber: "234234", agentName: "עידן כץ", totalPayment: "2342", totalInvestments: "678646", paymentMonth: "אפריל", date: "05/11/2016"},
            {companyName: "אלטשולר שחם", paymentType: "בונוס", agentNumber: "67868", agentName: "לנצמן", totalPayment: "5675", totalInvestments: "34234535", paymentMonth: "אפריל", date: "05/11/2016"},
            {companyName: "מנורה", paymentType: "גמ״ח", agentNumber: "789565", agentName: "לירון בן ציון", totalPayment: "4562", totalInvestments: "78768657", paymentMonth: "אפריל", date: "05/11/2016"},
            {companyName: "מגדל", paymentType: "היקף", agentNumber: "2342234523", agentName: "קרין בוזלי לוי", totalPayment: "23423", totalInvestments: "12342232", paymentMonth: "אפריל", date: "05/11/2016"},
            {companyName: "כלל", paymentType: "נפרעים", agentNumber: "234234", agentName: "עידן כץ", totalPayment: "2342", totalInvestments: "678646", paymentMonth: "אפריל", date: "05/11/2016"},
            {companyName: "אלטשולר שחם", paymentType: "בונוס", agentNumber: "67868", agentName: "לנצמן", totalPayment: "5675", totalInvestments: "34234535", paymentMonth: "אפריל", date: "05/11/2016"},
            {companyName: "מנורה", paymentType: "גמ״ח", agentNumber: "789565", agentName: "לירון בן ציון", totalPayment: "4562", totalInvestments: "78768657", paymentMonth: "אפריל", date: "05/11/2016"},
            {companyName: "ילין לפידות", paymentType: "היקף", agentNumber: "345654", agentName: "ויטלי", totalPayment: "6786", totalInvestments: "3453453", paymentMonth: "אפריל", date: "05/11/2016"},
            {companyName: "כלל", paymentType: "נפרעים", agentNumber: "234234", agentName: "עידן כץ", totalPayment: "2342", totalInvestments: "678646", paymentMonth: "אפריל", date: "05/11/2016"},

        ]


        return (
            <div className="commissions-page animated fadeIn">
                <FileBin />
                <div className="commissions-page-table shadow">
                     <Table columns={columns}
                            data={data}/>
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