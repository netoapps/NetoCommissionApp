import React from 'react'
import AuthService from '../../services/auth-service'
import { strings } from '../../constants/strings'
import Table from './../common/table.jsx'
import Dropdown from '../../../../../node_modules/muicss/lib/react/dropdown'
import DropdownItem from '../../../../../node_modules/muicss/lib/react/dropdown-item'
import Button from '../../../../../node_modules/muicss/lib/react/button'
import DatePicker from 'react-datepicker'
import Dropzone from 'react-dropzone'
import TextBox from './../common/text-box.jsx'

var moment = require('react-datepicker/node_modules/moment')

var companyNames = ["כלל","מנורה","הראל","אלטשולר שחם", "ילין לפידות","מיטב דש"];


class FileBin extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedCompany: "כלל",
            date: moment(),
            files: null,
            note: "בדיקה"
        };

    }
    onCompanyNameChange(item)
    {
        if(item.props.value != this.state.selectedCompany)
        {
            this.state.selectedCompany = item.props.value
            this.setState(this.state);
        }
    }
    handleChange(date)
    {
        this.state.date = date
        this.setState(this.state)
    }

    onDrop(files)
    {
        console.log('Received files: ', files)
        this.state.files = files
        this.setState(this.state)
    }
    onUploadFile()
    {
        var formData = new FormData();
        for (var i = 0; i < this.state.files.length; i++) {
            formData.append('file', this.state.files[i]);
        }
        // now post a new XHR request
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/commissions/upload');
        xhr.onload = function () {
            if (xhr.status === 200) {
                console.log('all done: ' + xhr.status);
            } else {
                console.log('Something went terribly wrong...');
            }
        };
        xhr.send(formData);
    }

    onEditFiles()
    {
        this.context.router.push('/app/commissions/edit-files')
    }

    onFileNoteBlur(e)
    {
        console.log(e.target.value)
    }

    render () {

        const companies = [];
        for (let i = 0; i < companyNames.length; i++ )
        {
            companies.push(<DropdownItem onClick={this.onCompanyNameChange.bind(this)} value={companyNames[i]} key={i}>{companyNames[i]}</DropdownItem>);
        }

        let style = {
            backgroundColor: 'transparent',
            color: '#505050'
        };

        let activeStyle = {
            backgroundColor: 'rgba(66, 134, 180, 0.15)'
        };

        return  <div className="commissions-page-file-bin shadow">
            <Dropzone onDrop={this.onDrop.bind(this)} className="commissions-page-file-bin-drag-area" style={style} activeStyle={activeStyle}>
                <strong>{strings.dragFileHere}</strong>
            </Dropzone>
            <div className="hcontainer-no-wrap">
                <div className="commissions-page-file-bin-settings hcontainer-no-wrap">
                    <div className="commissions-page-file-bin-settings-text">{strings.companyAssignment}</div>
                    <Dropdown label={this.state.selectedCompany} alignMenu="right" variant="raised">
                        {companies}
                    </Dropdown>
                    <div className="dashboard-buttons-horizontal-spacer"/>
                    <div className="dashboard-buttons-horizontal-spacer"/>
                    <div className="dashboard-buttons-horizontal-spacer"/>
                    <div className="commissions-page-file-bin-settings-text">{strings.paymentMonth}</div>
                    <div className="commissions-page-file-bin-settings-date">
                        <DatePicker selected={this.state.date} locale='he-IL' onChange={this.handleChange.bind(this)} />
                    </div>
                    <div className="dashboard-buttons-horizontal-spacer"/>
                    <div className="dashboard-buttons-horizontal-spacer"/>
                    <div className="dashboard-buttons-horizontal-spacer"/>
                    <div className="commissions-page-file-bin-settings-text">{strings.notes}</div>
                        <textarea className="commissions-page-file-note"
                            value={this.state.notes}
                            onBlur={this.onFileNoteBlur.bind(this)}/>
                    <div className="dashboard-buttons-horizontal-spacer"/>
                    <div className="dashboard-buttons-horizontal-spacer"/>
                    <div className="dashboard-buttons-horizontal-spacer"/>
                    <div className="dashboard-buttons-horizontal-spacer"/>
                    <div className="dashboard-buttons-horizontal-spacer"/>
                    <Button className="shadow" onClick={this.onUploadFile.bind(this)} color="primary">{strings.uploadFile}</Button>
                </div>
                <div className="commissions-page-file-bin-settings-edit-files-container">
                    <Button className="shadow" onClick={this.onEditFiles.bind(this)}>{strings.editFiles}</Button>
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
                type: 'read-only-currency',
                color: 'normal'
            },
            {
                title: "סה״כ גודל תיק",
                key: "totalInvestments",
                width: "col-33-33",
                type: 'read-only-currency',
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
                title: "תאריך העלאת קובץ",
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