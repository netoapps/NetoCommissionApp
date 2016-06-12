import React from 'react';
import Table from './table.jsx';
import AppActions from '../actions/app-actions'
import AppStore from '../stores/data-store'
import {ActionType} from '../actions/app-actions.js'
import Input from 'muicss/lib/react/input';
import { strings } from '../constants/strings'

class NewAgentPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
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
            <div className="new-agent-page animated fadeIn">
                <div className="new-agent-page-title">{strings.newAgentDetails}</div>
                <div className="new-agent-form hcontainer-no-wrap">
                    <div className="new-agent-form-item-box">
                        <Input label={strings.newAgentName} floatingLabel={true} />
                    </div>
                    <div className="new-agent-form-horizontal-spacer"/>
                    <div className="new-agent-form-item-box">
                        <Input label={strings.newAgentFamilyName} floatingLabel={true} />
                    </div>
                    <div className="new-agent-form-horizontal-spacer"/>
                    <div className="new-agent-form-item-box">
                        <Input label={strings.newAgentId} floatingLabel={true} />
                    </div>
                </div>
                <div className="new-agent-form hcontainer-no-wrap">
                    <div className="new-agent-form-item-box">
                        <Input label={strings.newAgentPhone} floatingLabel={true} />
                    </div>
                    <div className="new-agent-form-horizontal-spacer"/>
                    <div className="new-agent-form-item-box">
                        <Input label={strings.newAgentFax} floatingLabel={true} />
                    </div>
                    <div className="new-agent-form-horizontal-spacer"/>
                    <div className="new-agent-form-item-box">
                        <Input label={strings.newAgentEmail} floatingLabel={true} />
                    </div>
                </div>
                <div className="new-agent-form-table">
                    <Table columns={columns} data={data}/>
                </div>
            </div>
        );
    }
}

//Important!! This adds the router object to context
NewAgentPage.contextTypes = {
    router: React.PropTypes.object.isRequired
}

export default NewAgentPage;