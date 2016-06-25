import React from 'react';
import Table from './../common/table.jsx';
import AppActions from '../../actions/app-actions'
import AppStore from '../../stores/data-store'
import {ActionType} from '../../actions/app-actions.js'
import Input from 'muicss/lib/react/input';
import Checkbox from 'muicss/lib/react/checkbox'
import FixedWidthDropdown from './../common/fixed-width-dropdown.jsx';
import Dropdown from 'muicss/lib/react/dropdown';
import DropdownItem from 'muicss/lib/react/dropdown-item';
import { strings } from '../../constants/strings'
import Button from 'muicss/lib/react/button'
import {Agent} from '../../model/agent.js';

class AgentPage extends React.Component {

    constructor(props) {
        super(props);

        var agent = null
        var isNewAgent = true
        if (this.props.params.index != "-1")
        {
            isNewAgent = false
            agent = new Agent(AppStore.getAgentAtIndex(this.props.params.index))
        }
        else
        {
            agent = new Agent()
        }

        this.state = {
            isNewAgent: isNewAgent,
            agentIndex: this.props.params.index,
            agent: agent
        };

        this._onUpdateAgentEvent = this.onUpdateAgentEvent.bind(this)
    }

    componentDidMount()
    {
        AppStore.addEventListener(ActionType.UPDATE_AGENT, this._onUpdateAgentEvent);
    }
    componentWillUnmount()
    {
        AppStore.removeEventListener(ActionType.UPDATE_AGENT,this._onUpdateAgentEvent);
    }

    onUpdateAgentEvent()
    {
        console.log("onUpdateAgentEvent")
        this.state.agent = new Agent(AppStore.getAgentAtIndex(this.props.params.index))
        this.setState(this.state)
        console.log("onUpdateAgentEvent end")
    }

    onDeletePaymentRowClicked(rowIndex)
    {
        console.log("onDeletePaymentRowClicked " + rowIndex)
    }

    onAddRowClicked()
    {
        console.log("onAddRowClicked ")
    }


    onNewPaymentRow()
    {
        console.log("onNewPaymentRow " )
    }

    //Field changes
    onNameChange(e)
    {
        this.state.agent.name = e.target.value
        this.setState(this.state)
    }
    onFamilyNameChange(e)
    {
        this.state.agent.familyName = e.target.value
        this.setState(this.state)
    }
    onIdNumberChange(e)
    {
        this.state.agent.idNumber = e.target.value
        this.setState(this.state)
    }
    onPhoneNumberChange(e)
    {
        this.state.agent.phoneNumber = e.target.value
        this.setState(this.state)
    }
    onFaxNumberChange(e)
    {
        this.state.agent.faxNumber = e.target.value
        this.setState(this.state)
    }
    onEmailChange(e)
    {
        this.state.agent.email = e.target.value
        this.setState(this.state)
    }
    onActiveChange(item)
    {
        if(item.props.value == strings.agentPageActive)
        {
            this.state.agent.active = true
            this.setState(this.state)
        }
        else
        {
            this.state.agent.active = false
            this.setState(this.state)
        }
    }


    //Exit, save
    onExitClicked()
    {
        this.context.router.goBack()
    }
    onSaveClicked()
    {
        AppActions.updateAgentAtIndex(this.state.agentIndex,this.state.agent)
        this.context.router.goBack()
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


        var activeStates = []
        var selectedActiveState = this.state.agent.active ? strings.agentPageActive:strings.agentPageNotActive
        activeStates.push(<DropdownItem onClick={this.onActiveChange.bind(this)} value={strings.agentPageActive} key={0}>{strings.agentPageActive}</DropdownItem>)
        activeStates.push(<DropdownItem onClick={this.onActiveChange.bind(this)} value={strings.agentPageNotActive} key={1}>{strings.agentPageNotActive}</DropdownItem>)
        if (this.state.agent.active == false)
        {
            selectedActiveState = strings.agentPageNotActive
        }

        return (
            <div className="new-agent-page animated fadeIn">
                <div className="hcontainer-no-wrap">
                    <div className="new-agent-page-title">{strings.agentPageDetails}</div>
                    <div className="new-agent-form-horizontal-spacer-full"/>
                    <div className="new-agent-active-box"><FixedWidthDropdown shadow label={selectedActiveState} alignMenu="right" >
                        {activeStates}
                    </FixedWidthDropdown></div>
                </div>
                <div className="new-agent-form hcontainer-no-wrap">
                    <div className="new-agent-form-item-box">
                        <Input onChange={this.onNameChange.bind(this)} label={strings.agentPageName} defaultValue={this.state.agent.name} floatingLabel={true} />
                    </div>
                    <div className="new-agent-form-horizontal-spacer-50"/>
                    <div className="new-agent-form-item-box">
                        <Input onChange={this.onFamilyNameChange.bind(this)} label={strings.agentPageFamilyName} defaultValue={this.state.agent.familyName} floatingLabel={true} />
                    </div>
                    <div className="new-agent-form-horizontal-spacer-50"/>
                    <div className="new-agent-form-item-box">
                        <Input onChange={this.onIdNumberChange.bind(this)} label={strings.agentPageId} defaultValue={this.state.agent.idNumber} floatingLabel={true} />
                    </div>
                </div>
                <div className="new-agent-form hcontainer-no-wrap">
                    <div className="new-agent-form-item-box">
                        <Input onChange={this.onPhoneNumberChange.bind(this)} label={strings.agentPagePhone} defaultValue={this.state.agent.phoneNumber} floatingLabel={true} />
                    </div>
                    <div className="new-agent-form-horizontal-spacer-50"/>
                    <div className="new-agent-form-item-box">
                        <Input onChange={this.onFaxNumberChange.bind(this)} label={strings.agentPageFax} defaultValue={this.state.agent.faxNumber} floatingLabel={true} />
                    </div>
                    <div className="new-agent-form-horizontal-spacer-50"/>
                    <div className="new-agent-form-item-box">
                        <Input onChange={this.onEmailChange.bind(this)} label={strings.agentPageEmail} defaultValue={this.state.agent.email} floatingLabel={true} />
                    </div>
                </div>
                <div className="new-agent-form-table">
                    <Button className="shadow" onClick={this.onNewPaymentRow.bind(this)} color="primary">{strings.newPayment}</Button>
                    <Table onRemoveRow={this.onDeletePaymentRowClicked.bind(this)} columns={columns} data={this.state.agent.paymentsDetails}/>
                </div>
                <div className="hcontainer-no-wrap">
                    <div className="new-agent-form-horizontal-spacer-full"/>
                    <Button className="shadow" onClick={this.onExitClicked.bind(this)} color="default">{strings.agentPageExit}</Button>
                    <div className="new-agent-form-horizontal-spacer-20"/>
                    <Button className="shadow" onClick={this.onSaveClicked.bind(this)} color="primary">{strings.agentPageSave}</Button>
                </div>
            </div>
        );
    }
}

//                  <Table title={strings.agentPageTableTitle} onAddRow={this.onAddRowClicked.bind(this)} onRemoveRow={this.onDeletePaymentRowClicked.bind(this)} columns={columns} data={companies}/>


//Important!! This adds the router object to context
AgentPage.contextTypes = {
    router: React.PropTypes.object.isRequired
}

export default AgentPage;