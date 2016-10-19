import React from 'react';
import Table from './../common/table.jsx';
import AppActions from '../../actions/app-actions'
import AppStore from '../../stores/data-store'
import {ActionType} from '../../actions/app-actions.js'
import Input from 'muicss/lib/react/input';
import Dropdown from 'muicss/lib/react/dropdown';
import DropdownItem from 'muicss/lib/react/dropdown-item';
import { strings } from '../../constants/strings'
import Button from 'muicss/lib/react/button'
import {Agent,AgentPaymentDetails} from '../../model/agent.js';


class AgentPage extends React.Component {

    constructor(props) {
        super(props);

        this.companies = AppStore.getCompanies().concat("")
        this.commissionTypes = AppStore.getCommissionTypes().concat("")

        var agent = null
        var isNewAgent = true
        if (this.props.params.idNumber != "-1")
        {
            isNewAgent = false
            agent = new Agent(AppStore.getAgent(this.props.params.idNumber))
        }
        else
        {
            agent = new Agent()
        }

        this.state = {
            isNewAgent: isNewAgent,
            initialIdNumber: this.props.params.idNumber, /*save id number in case its modified so server can update the change*/
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
        this.state.agent = new Agent(AppStore.getAgent(this.props.params.idNumber))
        this.setState(this.state)
    }

    onDeletePaymentRowClicked(rowIndex)
    {
        this.state.agent.paymentsDetails.splice(rowIndex, 1)
        this.setState(this.state)
    }

    onNewPaymentRow()
    {
         this.state.agent.paymentsDetails.unshift(new AgentPaymentDetails())
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
        if(item == strings.active)
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

        if(this.state.isNewAgent)
        {
            if(AppStore.getAgent(this.state.agent.idNumber) != null)
            {
                swal({
                    title: "שגיאה",
                    text: "מספר מזהה קיים במערכת",
                    type: "error",
                    showCancelButton: false,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "סגור",
                    closeOnConfirm: true,
                    showLoaderOnConfirm: false
                });
                return
            }
            AppActions.addAgent(this.state.agent, (response) => {
                if(response.result)
                {
                    swal(
                        {
                            title: "",
                            text: "סוכן נשמר בהצלחה",
                            type: "success",
                            timer: 1500,
                            showConfirmButton: false
                        })
                }
                else
                {
                    swal({
                        title: "שגיאה",
                        text: "שגיאה בעת שמירת סוכן בשרת",
                        type: "error",
                        showCancelButton: false,
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "סגור",
                        closeOnConfirm: true,
                        showLoaderOnConfirm: false
                    });
                }
            })
        }
        else
        {
            AppActions.updateAgent(this.state.initialIdNumber,this.state.agent,(response) => {
                if(response.result)
                {
                    swal(
                        {
                            title: "",
                            text: "סוכן נשמר בהצלחה",
                            type: "success",
                            timer: 1500,
                            showConfirmButton: false
                        })
                }
                else
                {
                    swal({
                        title: "שגיאה",
                        text: "שגיאה בעת שמירת סוכן בשרת",
                        type: "error",
                        showCancelButton: false,
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "סגור",
                        closeOnConfirm: true,
                        showLoaderOnConfirm: false
                    });
                }

            })
        }
        this.context.router.goBack()
    }

    //Table changes
    onSelectCompany(index,value)
    {
        this.state.agent.paymentsDetails[index].companyName = value
        this.setState(this.state)
    }
    onSelectPaymentType(index,value)
    {
        this.state.agent.paymentsDetails[index].paymentType = value
        this.setState(this.state)
    }
    onAgentNumberChange(index,value)
    {
        var agentNumber = value
        if(!isNaN(agentNumber))
        {
            agentNumber = Number(agentNumber).toString()
        }
        this.state.agent.paymentsDetails[index].agentNumber = agentNumber
        this.setState(this.state)
    }
    onAgentPartChange(index,value)
    {
        if(value > 100)
            return

        this.state.agent.paymentsDetails[index].agentPart = value
        this.state.agent.paymentsDetails[index].agencyPart = "--"
        if(!isNaN(parseInt(value)))
        {
            this.state.agent.paymentsDetails[index].agencyPart = 100 - parseInt(value)
        }
        this.setState(this.state)
    }
    onRequestCompanyCellData(rowIndex, title)
    {
        var companyId = this.state.agent.paymentsDetails[rowIndex].companyName
        var companyName =  AppStore.getCompanyNameFromId(companyId)
        if (companyName == null)
        {
            console.error("Agent page - Could not find company name from id " + companyId)
        }
        return companyName
    }
    render () {

        var paymentColumns = [
            {
                title: "חברה",
                key: "-request-",
                width: "33%",
                type: 'select-request',
                color: 'normal',
                action: this.onSelectCompany.bind(this),
                options: this.companies,
                requestCellData: this.onRequestCompanyCellData.bind(this),
                searchBox: true
            },
            {
                title: "מספר סוכן",
                key: "agentNumber",
                width: "33%",
                type: 'input',
                color: 'normal',
                action: this.onAgentNumberChange.bind(this),
                searchBox: true
            },
            {
                title: "סוג תשלום",
                key: "paymentType",
                width: "33%",
                type: 'select',
                color: 'normal',
                action: this.onSelectPaymentType.bind(this),
                options: this.commissionTypes,
                searchBox: true
            },
            {
                title: "חלק סוכן %",
                key: "agentPart",
                width: "33%",
                type: 'input',
                color: 'normal',
                action: this.onAgentPartChange.bind(this),
                searchBox: true
            },
            {
                title: "חלק סוכנות %",
                key: "agencyPart",
                width: "33%",
                type: 'read-only',
                color: 'normal',
                searchBox: true
            }
        ]



        var activeStates = []
        var selectedActiveState = this.state.agent.active ? strings.active:strings.notActive
        activeStates.push(<DropdownItem className="mui--text-right" onClick={this.onActiveChange.bind(this,strings.active)} value={strings.active} key={0}>{strings.active}</DropdownItem>)
        activeStates.push(<DropdownItem className="mui--text-right" onClick={this.onActiveChange.bind(this,strings.notActive)} value={strings.notActive} key={1}>{strings.notActive}</DropdownItem>)

        return (
            <div className="page animated fadeIn shadow">
                <div className="hcontainer-no-wrap">
                    <div className="page-title">{strings.agentPageDetails}</div>
                    <div className="horizontal-spacer-90"/>
                    <div className="page-active-box"><Dropdown variant="raised" label={selectedActiveState} alignMenu="left" >
                        {activeStates}
                    </Dropdown></div>
                </div>
                <div className="page-form hcontainer-no-wrap">
                    <div className="page-form-item-box">
                        <Input onChange={this.onNameChange.bind(this)} label={strings.agentPageName}  defaultValue={this.state.agent.name} required={true} floatingLabel={true} />
                    </div>
                    <div className="horizontal-spacer-50"/>
                    <div className="page-form-item-box">
                        <Input onChange={this.onFamilyNameChange.bind(this)} label={strings.agentPageFamilyName} defaultValue={this.state.agent.familyName} required={true} floatingLabel={true} />
                    </div>
                    <div className="horizontal-spacer-50"/>
                    <div className="page-form-item-box">
                        <Input onChange={this.onIdNumberChange.bind(this)} label={strings.agentPageId} defaultValue={this.state.agent.idNumber} required={true} floatingLabel={true} />
                    </div>
                </div>
                <div className="page-form hcontainer-no-wrap">
                    <div className="page-form-item-box">
                        <Input onChange={this.onPhoneNumberChange.bind(this)} label={strings.agentPagePhone} defaultValue={this.state.agent.phoneNumber} floatingLabel={true} />
                    </div>
                    <div className="horizontal-spacer-50"/>
                    <div className="page-form-item-box">
                        <Input onChange={this.onFaxNumberChange.bind(this)} label={strings.agentPageFax} defaultValue={this.state.agent.faxNumber} floatingLabel={true} />
                    </div>
                    <div className="horizontal-spacer-50"/>
                    <div className="page-form-item-box">
                        <Input onChange={this.onEmailChange.bind(this)} label={strings.agentPageEmail} type="email" defaultValue={this.state.agent.email} floatingLabel={true} />
                    </div>
                </div>
                <Button className="shadow" onClick={this.onNewPaymentRow.bind(this)} color="primary">{strings.newPayment}</Button>
                <div className="agent-page-form-payments-details-table">
                    <Table  heightClass="agents-page-table-height"
                            onRemoveRow={this.onDeletePaymentRowClicked.bind(this)}
                            columns={paymentColumns}
                            data={this.state.agent.paymentsDetails}/>
                </div>
                <div className="vertical-spacer-10"/>
                <div className="hcontainer-no-wrap">
                    <div className="horizontal-spacer-90"/>
                    <Button className="shadow" onClick={this.onExitClicked.bind(this)} color="default">{strings.exit}</Button>
                    <div className="horizontal-spacer-20"/>
                    <Button className="shadow" onClick={this.onSaveClicked.bind(this)} color="primary">{strings.save}</Button>
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