import React from 'react';
import Table from './../common/table.jsx';
import AppActions from '../../actions/app-actions'
import AppStore from '../../stores/data-store'
import {ActionType} from '../../actions/app-actions.js'
import { strings } from '../../constants/strings'
import {Partnership,PartnershipPaymentDetails,PartnershipAgentDetails} from '../../model/partnership.js';
import FixedWidthDropdown from './../common/fixed-width-dropdown.jsx';
import DropdownItem from 'muicss/lib/react/dropdown-item';
import Button from 'muicss/lib/react/button'

class PartnershipPage extends React.Component {

    constructor(props) {
        super(props);

        var partnership = null
        var isNewPartnership = true
        if (this.props.params.index != "-1")
        {
            isNewPartnership = false
            //Make a copy of partnership
            partnership = new Partnership(AppStore.getPartnershipAtIndex(this.props.params.index))
        }
        else
        {
            partnership = new Partnership()
        }

        this.state = {
            isNewPartnership: isNewPartnership,
            partnershipIndex: this.props.params.index,
            partnership: partnership,
            agentsData: this.createAgentData(partnership),
            agentsListOpened: false,
            agentsListDataSource: AppStore.getAgents(),
            filteredAgents: []

        };

        this._onOutsideClick = this.onOutsideClick.bind(this)
        this._onUpdatePartnershipEvent = this.onUpdatePartnershipEvent.bind(this)
    }
    componentDidMount()
    {
        AppStore.addEventListener(ActionType.UPDATE_PARTNERSHIP, this._onUpdatePartnershipEvent);
    }
    componentWillUnmount()
    {
        AppStore.removeEventListener(ActionType.UPDATE_PARTNERSHIP,this._onUpdatePartnershipEvent);
    }
    createAgentData(partnership)
    {
        var agentsData = []
        for(var index = 0; index < partnership.agentsDetails.length ; index++)
        {
            var agentDetails = partnership.agentsDetails[index]
            var agent = AppStore.getAgent(agentDetails.idNumber)
            if (agent != null)
            {
                agentsData.push({
                    name: agent.name + " " + agent.familyName,
                    idNumber: agentDetails.idNumber,
                    part: agentDetails.part
                })
            }
            else
            {
                agentsData.push({
                    name: "לא ידוע",
                    idNumber: "----",
                    part: ""
                })
            }
        }
        return agentsData
    }
    onUpdatePartnershipEvent()
    {
        this.state.partnership = new Partnership(AppStore.getPartnershipAtIndex(this.props.params.index))
        this.state.agentsData = this.createAgentData(this.state.partnership)
        this.setState(this.state)
    }
    onOutsideClick(ev)
    {
        if(this.refs.agentsList != null)
        {
            let isClickInside = this.refs.agentsList.contains(ev.target);
            if (!isClickInside && this.state.agentsListOpened)
            {
                this.state.agentsListOpened = !this.state.agentsListOpened
                this.setState(this.state)
                document.removeEventListener('click', this._onOutsideClick);
            }
        }
    }

    onAgentPartChange(index,value)
    {
        this.state.partnership.agentsDetails[index].part = value
        this.state.agentsData[index].part = value
        this.setState(this.state)
    }

    onDeleteAgentRowClicked(rowIndex)
    {
        this.state.partnership.agentsDetails.splice(rowIndex, 1)
        this.state.agentsData.splice(rowIndex, 1)
        this.setState(this.state)
    }

    onActiveChange(item)
    {
        if(item.props.value == strings.active)
        {
            this.state.partnership.active = true
            this.setState(this.state)
        }
        else
        {
            this.state.partnership.active = false
            this.setState(this.state)
        }
    }

    filterAgents(text)
    {
        this.state.filteredAgents = []
        for(var index = 0; index < this.state.agentsListDataSource.length; index++)
        {
            var agent = this.state.agentsListDataSource[index]
            var agentName = agent.name + " " + agent.familyName
            if(agentName.includes(text))
            {
                this.state.filteredAgents.push(agent)
            }
        }
    }
    onAgentSearchChange(e)
    {
        this.filterAgents(e.target.value)
        this.setState(this.state)
    }

    onNewAgentRow()
    {
        this.state.agentsListOpened = !this.state.agentsListOpened
        if(this.state.agentsListOpened)
        {
            this.filterAgents("")
            document.addEventListener('click', this._onOutsideClick);
        }
        this.setState(this.state)
    }
    onSelectAgent(agent)
    {
        //Prevent duplicates
        for(var index = 0; index < this.state.agentsData.length; index++)
        {
            var agentData = this.state.agentsData[index]
            if(agentData.idNumber === agent.idNumber)
            {
                break
            }
        }
        if(index == this.state.agentsData.length)
        {
            this.state.agentsData.push({
                name: agent.name + " " + agent.familyName,
                idNumber: agent.idNumber,
                part: ""
            })
            var agentDetails = new PartnershipAgentDetails()
            agentDetails.idNumber = agent.idNumber
            agentDetails.part = agent.part
            this.state.partnership.agentsDetails.push(agentDetails)
        }
        this.state.agentsListOpened = false
        document.removeEventListener('click', this._onOutsideClick);
        this.setState(this.state)
    }

    //Table changes
    onSelectCompany(index,value)
    {
        this.state.partnership.paymentsDetails[index].companyName = value
        this.setState(this.state)
    }
    onSelectPaymentType(index,value)
    {
        this.state.partnership.paymentsDetails[index].paymentType = value
        this.setState(this.state)
    }
    onDeletePaymentRowClicked(rowIndex)
    {
        this.state.partnership.paymentsDetails.splice(rowIndex, 1)
        this.setState(this.state)
    }
    onNewPaymentRow()
    {
        this.state.partnership.paymentsDetails.push(new PartnershipPaymentDetails())
        this.setState(this.state)
    }
    onPartnershipNumberChange(index,value)
    {
        this.state.partnership.paymentsDetails[index].partnershipNumber = value
        this.setState(this.state)
    }
    onPartnershipPartChange(index,value)
    {
        if(value > 100)
            return

        this.state.partnership.paymentsDetails[index].partnershipPart = value
        this.state.partnership.paymentsDetails[index].agencyPart = "--"
        if(!isNaN(parseInt(value)))
        {
            this.state.partnership.paymentsDetails[index].agencyPart = 100 - parseInt(value)
        }
        this.setState(this.state)
    }

    //Exit, save
    onExitClicked()
    {
        this.context.router.goBack()
    }
    onSaveClicked()
    {
        if(this.state.isNewPartnership)
        {
            if(this.state.agentsData.length == 0)
            {
                swal({
                    title: "שגיאה",
                    text: "לא ניתן לשמור שותפות ללא סוכנים",
                    type: "error",
                    showCancelButton: false,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "סגור",
                    closeOnConfirm: true,
                    showLoaderOnConfirm: false
                });
                return
            }
            AppActions.addPartnership(this.state.partnership)
        }
        else
        {
            AppActions.updatePartnershipAtIndex(this.state.partnershipIndex,this.state.partnership)
        }
        this.context.router.goBack()
    }

    render () {


        var agentsTableColumns = [
            {
                title: "שם",
                key: "name",
                width: "col-33-33",
                type: 'read-only',
                color: 'normal'
            },
            {
                title: "מזהה",
                key: "idNumber",
                width: "col-33-33",
                type: 'read-only',
                color: 'normal'
            },
            {
                title: "חלק סוכן %",
                key: "part",
                width: "col-33-33",
                type: 'input',
                color: 'normal',
                action: this.onAgentPartChange.bind(this)
            }
        ]

        var activeStates = []
        var selectedActiveState = this.state.partnership.active ? strings.active:strings.notActive
        activeStates.push(<DropdownItem onClick={this.onActiveChange.bind(this)} value={strings.active} key={0}>{strings.active}</DropdownItem>)
        activeStates.push(<DropdownItem onClick={this.onActiveChange.bind(this)} value={strings.notActive} key={1}>{strings.notActive}</DropdownItem>)

        var agentsList = null
        if(this.state.agentsListOpened)
        {
            var items = []

            for(var index = 0; index < this.state.filteredAgents.length; index++)
            {
                var agent = this.state.filteredAgents[index]
                var agentName = agent.name + " " + agent.familyName
                items.push(<div key={index}><button onClick={ this.onSelectAgent.bind(this,agent)} className="agents-list-item-name">{agentName}</button><div className="agents-list-item-id">{agent.idNumber}</div></div>)
            }

            agentsList = <div ref="agentsList" className="agents-list">
                            <input className="agents-list-search-input"
                                   type="text"
                                   value={this.state.value}
                                   onChange={this.onAgentSearchChange.bind(this) }/>
                            <div className="agents-list-content">
                                {items}
                            </div>
                         </div>
        }

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
                key: "partnershipNumber",
                width: "col-33-33",
                type: 'input',
                color: 'normal',
                action: this.onPartnershipNumberChange.bind(this)
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
                title: "חלק שותפות %",
                key: "partnershipPart",
                width: "col-33-33",
                type: 'input',
                color: 'normal',
                action: this.onPartnershipPartChange.bind(this)
            },
            {
                title: "חלק סוכנות %",
                key: "agencyPart",
                width: "col-33-33",
                type: 'read-only',
                color: 'normal'
            }
        ]


        return (
            <div className="page animated fadeIn shadow">
                <div className="hcontainer-no-wrap">
                    <div className="page-title">{strings.partnershipPageDetails}</div>
                    <div className="horizontal-spacer-90"/>
                    <div className="page-active-box"><FixedWidthDropdown shadow label={selectedActiveState} alignMenu="right" >
                        {activeStates}
                    </FixedWidthDropdown></div>
                </div>
                <div className="hcontainer-no-wrap">
                    <Button className="shadow" onClick={this.onNewAgentRow.bind(this)} color="primary">{strings.newAgent}</Button>
                    {agentsList}
                </div>
                <div className="partnership-page-form-agents-table">
                    <Table onRemoveRow={this.onDeleteAgentRowClicked.bind(this)} columns={agentsTableColumns} data={this.state.agentsData}/>
                </div>

                <Button className="shadow" onClick={this.onNewPaymentRow.bind(this)} color="primary">{strings.newPayment}</Button>
                <div className="partnership-page-form-payments-details-table">
                    <Table onRemoveRow={this.onDeletePaymentRowClicked.bind(this)} columns={columns} data={this.state.partnership.paymentsDetails}/>
                </div>
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

//Important!! This adds the router object to context
PartnershipPage.contextTypes = {
    router: React.PropTypes.object.isRequired
}

export default PartnershipPage;