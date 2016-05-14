import React from 'react';
import AuthService from '../services/auth-service'
import { strings } from '../constants/strings'
import Table from './table.jsx';
import Dropdown from 'muicss/lib/react/dropdown';
import DropdownItem from 'muicss/lib/react/dropdown-item';
import FixedWidthDropdown from './FixedWidthDropdown.jsx';
import Button from 'muicss/lib/react/button'

var companyNames = ["כלל","מנורה","הראל","אלטשולר שחם", "ילין לפידות","מיטב דש"

];


class FileBin extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedCompany: "כלל",
            date: ""
        };

    }
    onCompanyNameChange(item)
    {
        if(item.props.value != this.state.selectedCompany)
        {
            this.setState({selectedCompany: item.props.value});
        }
    }
    onUploadFile()
    {

    }
    render () {

        const companies = [];
        for (let i = 0; i < companyNames.length; i++ )
        {
            companies.push(<DropdownItem onClick={this.onCompanyNameChange.bind(this)} value={companyNames[i]} key={i}>{companyNames[i]}</DropdownItem>);
        }

        return  <div className="commissions-page-file-bin shadow">
                    <div className="commissions-page-file-bin-drag-area">
                        <strong>{strings.dragFileHere}</strong>
                    </div>
                    <div className="commissions-page-file-bin-settings hcontainer-no-wrap">
                        <div className="commissions-page-file-bin-settings-text">{strings.companyAssignment}</div>
                        <Dropdown label={this.state.selectedCompany} alignMenu="right" variant="raised">
                            {companies}
                        </Dropdown>
                        <div className="dashboard-buttons-horizontal-spacer"/>
                        <div className="dashboard-buttons-horizontal-spacer"/>
                        <div className="dashboard-buttons-horizontal-spacer"/>
                        <div className="commissions-page-file-bin-settings-text">{strings.validDate}</div>
                        <FixedWidthDropdown className="fixed-size-button" label="תאריך" alignMenu="right" >
                        </FixedWidthDropdown>
                        <div className="dashboard-buttons-horizontal-spacer"/>
                        <div className="dashboard-buttons-horizontal-spacer"/>
                        <div className="dashboard-buttons-horizontal-spacer"/>
                        <div className="dashboard-buttons-horizontal-spacer"/>
                        <div className="dashboard-buttons-horizontal-spacer"/>
                        <Button className="shadow" onClick={this.onUploadFile.bind(this)} color="primary">{strings.uploadFile}</Button>
                    </div>
                </div>
        ;
    }
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
                title: "חודש תשלום",
                key: "paymentMonth",
                width: "col-33-33",
                type: 'read-only',
                color: 'normal'
            },
            {
                title: "תאריך נכונות",
                key: "date",
                width: "col-33-33",
                type: 'read-only',
                color: 'normal'
            }

        ]

        var data = [
            {companyName: "מגדל", paymentType: "היקף", agentNumber: "2342234523", agentName: "קרין בוזלי לוי", totalPayment: "23423", totalInvestments: "12342232", paymentMonth: "אפריל", date: "05/11/2016"},
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