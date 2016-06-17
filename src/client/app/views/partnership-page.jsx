import React from 'react';
import Table from './table.jsx';
import AppActions from '../actions/app-actions'
import AppStore from '../stores/data-store'
import {ActionType} from '../actions/app-actions.js'
import Input from 'muicss/lib/react/input';
import { strings } from '../constants/strings'

class PartnershipPage extends React.Component {

    constructor(props) {
        super(props);

        var newAgent = this.props.params.agentId == "new"
        this.state = {
            newAgent: newAgent,
            agentData: null
        };
    }
    componentWillReceiveProps(nextProps)
    {
        this.state.newAgent = nextProps.params.agentId == "new"
        this.setState(this.state)
    }
    componentWillMount()
    {
        if(this.state.newAgent == true)
        {
            this.state.agentData = AppStore.getAgent()
        }
    }

    componentDidMount()
    {

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
                title: "סוג תשלום",
                key: "paymentType",
                width: "col-33-33",
                type: 'read-only',
                color: 'normal'
            },
            {
                title: "חלק סוכן",
                key: "agentPart",
                width: "col-33-33",
                type: 'read-only',
                color: 'normal'
            },
            {
                title: "חלק סוכנות",
                key: "agencyPart",
                width: "col-33-33",
                type: 'read-only',
                color: 'normal'
            }
        ]

        var data = [
            {companyName: "מגדל", agentNumber: "2342234523",paymentType: "נפרעים",  agentPart: "55%", agencyPart: "45%"},
            {companyName: "אלטשולר שחם", agentNumber: "234234",paymentType: "היקף",  agentPart: "55%", agencyPart: "45%"},
            {companyName: "מנורה", agentNumber: "789565",paymentType: "בונוס",  agentPart: "55%", agencyPart: "45%"}
        ]


        return (
            <div className="new-agent-page animated fadeIn">
                <div className="new-agent-page-title">{strings.partnershipPageDetails}</div>
                <div className="new-agent-form hcontainer-no-wrap">
                    <div className="new-agent-form-item-box">
                        <Input label={strings.partnershipPageName} floatingLabel={true} />
                    </div>
                    <div className="new-agent-form-horizontal-spacer"/>
                    <div className="new-agent-form-item-box">
                        <Input label={strings.partnershipPageFamilyName} floatingLabel={true} />
                    </div>
                    <div className="new-agent-form-horizontal-spacer"/>
                    <div className="new-agent-form-item-box">
                        <Input label={strings.partnershipPageId} floatingLabel={true} />
                    </div>
                </div>
                <div className="new-agent-form hcontainer-no-wrap">
                    <div className="new-agent-form-item-box">
                        <Input label={strings.partnershipPagePhone} floatingLabel={true} />
                    </div>
                    <div className="new-agent-form-horizontal-spacer"/>
                    <div className="new-agent-form-item-box">
                        <Input label={strings.partnershipPageFax} floatingLabel={true} />
                    </div>
                    <div className="new-agent-form-horizontal-spacer"/>
                    <div className="new-agent-form-item-box">
                        <Input label={strings.partnershipPageEmail} floatingLabel={true} />
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
PartnershipPage.contextTypes = {
    router: React.PropTypes.object.isRequired
}

export default PartnershipPage;