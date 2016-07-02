import React from 'react';
import Table from './../common/table.jsx';
import AppActions from '../../actions/app-actions'
import AppStore from '../../stores/data-store'
import {ActionType} from '../../actions/app-actions.js'
import Input from '../../../../../node_modules/muicss/lib/react/input';
import { strings } from '../../constants/strings'
import {Partnership,PartnershipPaymentDetails,PartnershipAgentDetails} from '../../model/partnership.js';
import FixedWidthDropdown from './../common/fixed-width-dropdown.jsx';
import Dropdown from 'muicss/lib/react/dropdown';
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
            partnership = new Partnership(AppStore.getPartnershipAtIndex(this.props.params.index))
        }
        else
        {
            partnership = new Partnership()
        }

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
                    name: "",
                    idNumber: "",
                    part: ""
                })
            }
        }

        this.state = {
            isNewPartnership: isNewPartnership,
            partnershipIndex: this.props.params.index,
            partnership: partnership,
            agentsData: agentsData,
            agentsListOpened: false,
            agentsListDataSource: AppStore.getAgents(),
            filteredAgents: []

        };

        this._onOutsideClick = this.onOutsideClick.bind(this)
    }
    componentWillMount() {
    }

    componentWillUnmount() {
    }

    onOutsideClick(ev)
    {
        let isClickInside = this.refs.agentsList.contains(ev.target);
        if (!isClickInside && this.state.agentsListOpened)
        {
            this.state.agentsListOpened = !this.state.agentsListOpened
            this.setState(this.state)
            document.removeEventListener('click', this._onOutsideClick);
        }
    }


    onAgentPartChange(index,value)
    {
        this.state.agentsData[index].part = value
        this.setState(this.state)
    }

    onDeleteAgentRowClicked(rowIndex)
    {
        this.state.partnership.agentsDetails.splice(rowIndex, 1)
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
        }
        this.state.agentsListOpened = false
        document.removeEventListener('click', this._onOutsideClick);
        this.setState(this.state)

        //var partnership = new PartnershipAgentDetails()
        //partnership.name = agent.name
        //partnership.familyName = agent.familyName
        //partnership.idNumber = agent.idNumber
        //partnership.part = ""
        //this.state.partnership.agentsDetails.push(partnership)
    }

    render () {


        var agentsTableColumns = [
            {
                title: "שם",
                key: "name",
                width: "col-33-33",
                type: 'read-only',
                color: 'normal',
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


        return (
            <div className="page animated fadeIn">
                <div className="hcontainer-no-wrap">
                    <div className="page-title">{strings.partnershipPageDetails}</div>
                    <div className="page-form-horizontal-spacer-full"/>
                    <div className="page-active-box"><FixedWidthDropdown shadow label={selectedActiveState} alignMenu="right" >
                        {activeStates}
                    </FixedWidthDropdown></div>
                </div>
                <div className="hcontainer-no-wrap">
                    <Button className="shadow" onClick={this.onNewAgentRow.bind(this)} color="primary">{strings.newAgent}</Button>
                    {agentsList}
                </div>
                <div className="page-form-table">
                    <Table onRemoveRow={this.onDeleteAgentRowClicked.bind(this)} columns={agentsTableColumns} data={this.state.agentsData}/>
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