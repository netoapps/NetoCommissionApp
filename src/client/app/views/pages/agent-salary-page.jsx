import React from 'react';
import Table from './../common/table.jsx';
import AppActions from '../../actions/app-actions'
import AppStore from '../../stores/data-store'
import {ActionType} from '../../actions/app-actions.js'
import Input from '../../../../../node_modules/muicss/lib/react/input';
import { strings } from '../../constants/strings'

class AgentSalaryPage extends React.Component {

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
        if(this.state.newAgent == false)
        {
            this.state.agentData = AppStore.getAgent(this.props.params.agentId)
        }
    }

    componentDidMount()
    {

    }

    onCompanyNameSelect(rowIndex, companyName)
    {
        console.log(rowIndex)
        console.log(companyName)
    }
    onCommissionTypeSelect(rowIndex, commissionType)
    {

    }
    render () {


        var columns = [

            {
                title: "חברה",
                key: "companyName",
                width: "col-33-33",
                type: 'select',
                color: 'normal',
                options: AppStore.getCompanies(),
                action: this.onCompanyNameSelect.bind(this)
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
                type: 'select',
                color: 'normal',
                options: AppStore.getCommissionTypes(),
                action: this.onCommissionTypeSelect.bind(this)
            },
            {
                title: "חלק סוכן %",
                key: "agentPart",
                width: "col-33-33",
                type: 'read-only',
                color: 'normal'
            },
            {
                title: "חלק סוכנות %",
                key: "agencyPart",
                width: "col-33-33",
                type: 'read-only',
                color: 'normal'
            }
        ]

        var name = "",familyName = "",idNumber = "",phoneNumber = "",faxNumber = "",email = "",active = "",companies = null
        if(this.state.newAgent == false)
        {
            name = this.state.agentData.name
            familyName = this.state.agentData.familyName
            idNumber = this.state.agentData.idNumber
            phoneNumber = this.state.agentData.phoneNumber
            faxNumber = this.state.agentData.faxNumber
            email = this.state.agentData.email
            active = this.state.agentData.active
            companies = this.state.agentData.companies
        }

        return (
            <div className="new-agent-page animated fadeIn">
                <div className="new-agent-page-title">{strings.agentSalaryPage}</div>
                <div className="new-agent-form hcontainer-no-wrap">
                    <div className="new-agent-form-item-box">
                        <Input label={strings.agentPageName} defaultValue={name} floatingLabel={true} />
                    </div>
                    <div className="new-agent-form-horizontal-spacer"/>
                    <div className="new-agent-form-item-box">
                        <Input label={strings.agentPageFamilyName} defaultValue={familyName} floatingLabel={true} />
                    </div>
                    <div className="new-agent-form-horizontal-spacer"/>
                    <div className="new-agent-form-item-box">
                        <Input label={strings.agentPageId} defaultValue={idNumber} floatingLabel={true} />
                    </div>
                </div>
                <div className="new-agent-form hcontainer-no-wrap">
                    <div className="new-agent-form-item-box">
                        <Input label={strings.agentPagePhone} defaultValue={phoneNumber} floatingLabel={true} />
                    </div>
                    <div className="new-agent-form-horizontal-spacer"/>
                    <div className="new-agent-form-item-box">
                        <Input label={strings.agentPageFax} defaultValue={faxNumber} floatingLabel={true} />
                    </div>
                    <div className="new-agent-form-horizontal-spacer"/>
                    <div className="new-agent-form-item-box">
                        <Input label={strings.agentPageEmail} defaultValue={email} floatingLabel={true} />
                    </div>
                </div>
                <div className="new-agent-form-table">
                    <Table columns={columns} data={companies}/>
                </div>
            </div>
        );
    }
}

//Important!! This adds the router object to context
AgentSalaryPage.contextTypes = {
    router: React.PropTypes.object.isRequired
}

export default AgentSalaryPage;