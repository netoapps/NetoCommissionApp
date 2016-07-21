import React from 'react';
import AuthService from '../../services/auth-service'
import Tabs from 'muicss/lib/react/tabs'
import Tab from 'muicss/lib/react/tab'
import { strings } from '../../constants/strings'
import Button from 'muicss/lib/react/button'
import Table from './../common/table.jsx'
import AppStore from '../../stores/data-store'
import AppActions from '../../actions/app-actions'
import {ActionType} from '../../actions/app-actions.js'

//Global since its not save when user comes back to page
var selectedTab = 0

class AgentsAndPartnerships extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            loginData: AuthService.getLoginData(),
            agents: AppStore.getAgents(),
            partnerships:AppStore.getPartnerships()
        };

        this._onDeleteAgentEvent = this.onDeleteAgentEvent.bind(this)
        this._onUpdateAgentEvent = this.onUpdateAgentEvent.bind(this)
        this._onAddAgentEvent = this.onAddAgentEvent.bind(this)

        this._onDeletePartnershipEvent = this.onDeletePartnershipEvent.bind(this)
        this._onUpdatePartnershipEvent = this.onUpdatePartnershipEvent.bind(this)
        this._onAddPartnershipEvent = this.onAddPartnershipEvent.bind(this)
    }

    componentDidMount()
    {
        AppStore.addEventListener(ActionType.DELETE_AGENT, this._onDeleteAgentEvent);
        AppStore.addEventListener(ActionType.ADD_AGENT, this._onAddAgentEvent);
        AppStore.addEventListener(ActionType.UPDATE_AGENT, this._onUpdateAgentEvent);

        AppStore.addEventListener(ActionType.DELETE_PARTNERSHIP, this._onDeletePartnershipEvent);
        AppStore.addEventListener(ActionType.ADD_PARTNERSHIP, this._onAddPartnershipEvent);
        AppStore.addEventListener(ActionType.UPDATE_PARTNERSHIP, this._onUpdatePartnershipEvent);
    }
    componentWillUnmount()
    {
        AppStore.removeEventListener(ActionType.DELETE_AGENT,this._onDeleteAgentEvent);
        AppStore.removeEventListener(ActionType.ADD_AGENT,this._onAddAgentEvent);
        AppStore.removeEventListener(ActionType.UPDATE_AGENT,this._onUpdateAgentEvent);

        AppStore.removeEventListener(ActionType.DELETE_PARTNERSHIP,this._onDeletePartnershipEvent);
        AppStore.removeEventListener(ActionType.ADD_PARTNERSHIP,this._onAddPartnershipEvent);
        AppStore.removeEventListener(ActionType.UPDATE_PARTNERSHIP,this._onUpdatePartnershipEvent);
    }

    //Agents
    onAddAgentEvent()
    {
        console.log("onAddAgentEvent")
        this.state.agents = AppStore.getAgents()
        this.setState(this.state)
    }
    onUpdateAgentEvent() {
        console.log("onUpdateAgentEvent")
        this.state.agents = AppStore.getAgents()
        this.setState(this.state)
    }
    onDeleteAgentEvent()
    {
        console.log("onDeleteAgentEvent")
        this.state.agents = AppStore.getAgents()
        this.setState(this.state)
    }
    onNewAgent()
    {
        this.context.router.push('/app/agents-and-partnerships/agent-page/' + (-1))
    }
    onAgentClicked(rowIndex)
    {
        this.context.router.push('/app/agents-and-partnerships/agent-page/'+rowIndex)
    }
    onDeleteAgentClicked(rowIndex)
    {
        AppActions.deleteAgentAtIndex(rowIndex)
    }

    //Partnerships
    onAddPartnershipEvent()
    {
        console.log("onAddPartnershipEvent")
        this.state.partnerships = AppStore.getPartnerships()
        this.setState(this.state)
    }
    onUpdatePartnershipEvent()
    {
        console.log("onUpdatePartnershipEvent")
        this.state.partnerships = AppStore.getPartnerships()
        this.setState(this.state)
    }
    onDeletePartnershipEvent()
    {
        console.log("onDeletePartnershipEvent")
        this.state.partnerships = AppStore.getPartnerships()
        this.setState(this.state)
    }
    onNewPartnership()
    {
        this.context.router.push('/app/agents-and-partnerships/partnership-page/' + (-1))
    }
    onDeletePartnershipsClicked(rowIndex)
    {
        AppActions.deletePartnershipAtIndex(rowIndex)
    }
    onPartnershipClicked(rowIndex)
    {
        this.context.router.push('/app/agents-and-partnerships/partnership-page/'+rowIndex)
    }

    //UI
    onChangeTab(i, value, tab, ev)
    {
        selectedTab = i
        this.setState(this.state)
    }

    //Salary
    onSalaryClicked(rowIndex)
    {
        this.context.router.push('/app/agents-and-partnerships/agent-salary-page/'+rowIndex)
    }

    render () {

        var agentsColumns = [

            {
                title: "שם",
                key: "name",
                width: "col-33-33",
                type: 'button',
                color: 'blue',
                action: this.onAgentClicked.bind(this)
            },
            {
                title: "שכר",
                key: "salary",
                width: "col-33-33",
                type: 'button',
                format: 'currency',
                color: 'blue',
                action: this.onSalaryClicked.bind(this)
            },
            {
                title: "מזהה",
                key: "idNumber",
                width: "col-33-33",
                type: 'read-only',
                color: 'normal'
            },
            {
                title: "סטטוס",
                key: "status",
                width: "col-33-33",
                type: 'read-only',
                color: 'normal'
            }
        ]



        var agentsData = []
        for(var agentIndex = 0; agentIndex < this.state.agents.length; agentIndex++)
        {
            var agentData = {}

            agentData["name"] = this.state.agents[agentIndex].name + " " + this.state.agents[agentIndex].familyName
            agentData["salary"] = "323432"
            agentData["idNumber"] = this.state.agents[agentIndex].idNumber
            agentData["status"] = this.state.agents[agentIndex].active ? "פעיל":"לא פעיל"
            agentsData.push(agentData)
        }

        var partnershipColumns = [

            {
                title: "שותפים",
                key: "names",
                width: "col-33-33",
                type: 'button',
                color: 'blue',
                action: this.onPartnershipClicked.bind(this)
            },
            {
                title: "מזהה",
                key: "idNumbers",
                width: "col-33-33",
                type: 'read-only',
                color: 'normal'
            },
            {
                title: "סטטוס",
                key: "status",
                width: "col-33-33",
                type: 'read-only',
                color: 'normal'
            }
        ]


        var partnershipsData = []
        for(var partnershipIndex = 0; partnershipIndex < this.state.partnerships.length; partnershipIndex++)
        {
            var partnershipData = {}
            partnershipData["names"] = ""
            partnershipData["idNumbers"] = ""
            for(var idIndex = 0; idIndex < this.state.partnerships[partnershipIndex].agentsDetails.length ; idIndex++)
            {
                agentData = AppStore.getAgent(this.state.partnerships[partnershipIndex].agentsDetails[idIndex].idNumber)
                if(agentData != null)
                {
                    partnershipData["names"] += (agentData.name + " " + agentData.familyName)
                    partnershipData["idNumbers"] += agentData.idNumber
                    if(idIndex < (this.state.partnerships[partnershipIndex].agentsDetails.length-1))
                    {
                        partnershipData["names"] += ", "
                        partnershipData["idNumbers"] += ", "
                    }
                }
            }
            partnershipData["status"] = this.state.partnerships[partnershipIndex].active ? "פעיל":"לא פעיל"
            partnershipsData.push(partnershipData)
        }


        return (
            <div className="agents-and-partnerships-page animated fadeIn shadow">
                <Tabs onChange={this.onChangeTab.bind(this)} justified={true} initialSelectedIndex={selectedTab}>
                    <Tab value="pane-1" label={strings.agents}>

                        <div className="agents-page-tab-container">
                            <div className="agents-page-vertical-spacer"/>
                            <Button className="shadow" onClick={this.onNewAgent.bind(this)} color="primary">{strings.newAgent}</Button>
                            <div className="agents-page-table">
                                <Table onRemoveRow={this.onDeleteAgentClicked.bind(this)} columns={agentsColumns} data={agentsData}/>
                            </div>
                        </div>

                    </Tab>
                    <Tab value="pane-2" label={strings.partnerships}>

                        <div className="agents-page-tab-container">
                            <div className="agents-page-vertical-spacer"/>
                            <Button className="shadow" onClick={this.onNewPartnership.bind(this)} color="primary">{strings.newPartnership}</Button>
                            <div className="agents-page-table">
                                <Table onRemoveRow={this.onDeletePartnershipsClicked.bind(this)} columns={partnershipColumns} data={partnershipsData}/>
                            </div>
                        </div>
                    </Tab>
                </Tabs>
            </div>
        );
    }
}

//Important!! This adds the router object to context
AgentsAndPartnerships.contextTypes = {
    router: React.PropTypes.object.isRequired
}

export default AgentsAndPartnerships;