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

class AgentsAndPartnerships extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            loginData: AuthService.getLoginData(),
            selectedTab: 0,
            agents: AppStore.getAgents(),
            partnerships:AppStore.getPartnerships()
        };

        this._onDeleteAgentEvent = this.onDeleteAgentEvent.bind(this)
        this._onDeletePartnershipEvent = this.onDeletePartnershipEvent.bind(this)
    }

    componentDidMount()
    {
        AppStore.addEventListener(ActionType.DELETE_AGENT, this._onDeleteAgentEvent);
        AppStore.addEventListener(ActionType.DELETE_PARTNERSHIP, this._onDeletePartnershipEvent);
    }
    componentWillUnmount()
    {
        AppStore.removeEventListener(ActionType.DELETE_AGENT,this._onDeleteAgentEvent);
        AppStore.removeEventListener(ActionType.DELETE_PARTNERSHIP,this._onDeletePartnershipEvent);
    }

    //Agents
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
        this.state.selectedTab = i
        this.setState(this.state)
        console.log(arguments);
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
            <div className="agents-page animated fadeIn">
                <Tabs onChange={this.onChangeTab.bind(this)} justified={true} initialSelectedIndex={this.state.selectedTab}>
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