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
import {Agent,AgentPaymentDetails} from '../../model/agent.js';

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
        this.state.agent = new Agent(AppStore.getAgentAtIndex(this.props.params.index))
        this.setState(this.state)
    }

    onDeletePaymentRowClicked(rowIndex)
    {
        this.state.agent.paymentsDetails.splice(rowIndex, 1)
        this.setState(this.state)
    }

    onNewPaymentRow()
    {
        this.state.agent.paymentsDetails.push(new AgentPaymentDetails())
        this.setState(this.state)
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
        if(this.state.agent.name.length == 0)
        {
            swal({
                    title: "שגיאה",
                    text: "לא הוזן שם פרטי",
                    type: "error",
                    showCancelButton: false,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "סגור",
                    closeOnConfirm: true,
                    showLoaderOnConfirm: false
                });
            return
        }
        if(this.state.agent.familyName.length == 0)
        {
            swal({
                title: "שגיאה",
                text: "לא הוזן שם משפחה",
                type: "error",
                showCancelButton: false,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "סגור",
                closeOnConfirm: true,
                showLoaderOnConfirm: false
            });
            return
        }
        if(this.state.agent.idNumber.length == 0)
        {
            swal({
                title: "שגיאה",
                text: "לא הוזן מספר מזהה",
                type: "error",
                showCancelButton: false,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "סגור",
                closeOnConfirm: true,
                showLoaderOnConfirm: false
            });
            return
        }
        AppActions.updateAgentAtIndex(this.state.agentIndex,this.state.agent)
        this.context.router.goBack()
    }

    //Table changes
    onSelectCompany(index,item)
    {
        this.state.agent.paymentsDetails[index].companyName = item.props.value
        this.setState(this.state)
    }
    onSelectPaymentType(index,item)
    {
        this.state.agent.paymentsDetails[index].paymentType = item.props.value
        this.setState(this.state)
    }
    onAgentNumberChange(index,value)
    {
        this.state.agent.paymentsDetails[index].agentNumber = value
        this.setState(this.state)
    }
    onAgentPartChange(index,value)
    {
        this.state.agent.paymentsDetails[index].agentPart = value
        this.state.agent.paymentsDetails[index].agencyPart = "--"
        if(!isNaN(parseInt(value)))
        {
            this.state.agent.paymentsDetails[index].agencyPart = 100 - parseInt(value)
        }
        this.setState(this.state)
    }
    onAgencyPartChange(index,value)
    {
        this.state.agent.paymentsDetails[index].agencyPart = value
        this.setState(this.state)
    }
    render () {


        var columns = [
            {
                title: "חברה",
                key: "companyName",
                width: "col-33-33",
                type: 'select',
                color: 'normal',
                action: this.onSelectCompany.bind(this),
                options: AppStore.getCompanies()
            },
            {
                title: "מספר סוכן",
                key: "agentNumber",
                width: "col-33-33",
                type: 'input',
                color: 'normal',
                action: this.onAgentNumberChange.bind(this)
            },
            {
                title: "סוג תשלום",
                key: "paymentType",
                width: "col-33-33",
                type: 'select',
                color: 'normal',
                action: this.onSelectPaymentType.bind(this),
                options: AppStore.getCommissionTypes()
            },
            {
                title: "חלק סוכן %",
                key: "agentPart",
                width: "col-33-33",
                type: 'input',
                color: 'normal',
                action: this.onAgentPartChange.bind(this)
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
        var selectedActiveState = this.state.agent.active ? strings.active:strings.notActive
        activeStates.push(<DropdownItem onClick={this.onActiveChange.bind(this)} value={strings.active} key={0}>{strings.active}</DropdownItem>)
        activeStates.push(<DropdownItem onClick={this.onActiveChange.bind(this)} value={strings.notActive} key={1}>{strings.notActive}</DropdownItem>)

        return (
            <div className="page animated fadeIn">
                <div className="hcontainer-no-wrap">
                    <div className="page-title">{strings.agentPageDetails}</div>
                    <div className="page-form-horizontal-spacer-full"/>
                    <div className="page-active-box"><FixedWidthDropdown shadow label={selectedActiveState} alignMenu="right" >
                        {activeStates}
                    </FixedWidthDropdown></div>
                </div>
                <div className="page-form hcontainer-no-wrap">
                    <div className="page-form-item-box">
                        <Input onChange={this.onNameChange.bind(this)} label={strings.agentPageName}  defaultValue={this.state.agent.name} required={true} floatingLabel={true} />
                    </div>
                    <div className="page-form-horizontal-spacer-50"/>
                    <div className="page-form-item-box">
                        <Input onChange={this.onFamilyNameChange.bind(this)} label={strings.agentPageFamilyName} defaultValue={this.state.agent.familyName} required={true} floatingLabel={true} />
                    </div>
                    <div className="page-form-horizontal-spacer-50"/>
                    <div className="page-form-item-box">
                        <Input onChange={this.onIdNumberChange.bind(this)} label={strings.agentPageId} defaultValue={this.state.agent.idNumber} required={true} floatingLabel={true} />
                    </div>
                </div>
                <div className="page-form hcontainer-no-wrap">
                    <div className="page-form-item-box">
                        <Input onChange={this.onPhoneNumberChange.bind(this)} label={strings.agentPagePhone} defaultValue={this.state.agent.phoneNumber} floatingLabel={true} />
                    </div>
                    <div className="page-form-horizontal-spacer-50"/>
                    <div className="page-form-item-box">
                        <Input onChange={this.onFaxNumberChange.bind(this)} label={strings.agentPageFax} defaultValue={this.state.agent.faxNumber} floatingLabel={true} />
                    </div>
                    <div className="page-form-horizontal-spacer-50"/>
                    <div className="page-form-item-box">
                        <Input onChange={this.onEmailChange.bind(this)} label={strings.agentPageEmail} type="email" defaultValue={this.state.agent.email} floatingLabel={true} />
                    </div>
                </div>
                <Button className="shadow" onClick={this.onNewPaymentRow.bind(this)} color="primary">{strings.newPayment}</Button>
                <div className="page-form-table">
                    <Table onRemoveRow={this.onDeletePaymentRowClicked.bind(this)} columns={columns} data={this.state.agent.paymentsDetails}/>
                </div>
                <div className="hcontainer-no-wrap">
                    <div className="page-form-horizontal-spacer-full"/>
                    <Button className="shadow" onClick={this.onExitClicked.bind(this)} color="default">{strings.agentPageExit}</Button>
                    <div className="page-form-horizontal-spacer-20"/>
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