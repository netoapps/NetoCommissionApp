import React from 'react';
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
            agents: AppStore.getAgents(),
            partnerships:AppStore.getPartnerships()
        };

        this._reloadAgentsData = this.reloadAgentsData.bind(this)
        this._reloadPartnershipsData = this.reloadPartnershipsData.bind(this)
    }

    componentDidMount()
    {
        AppStore.addEventListener(ActionType.AGENTS_LOADED, this._reloadAgentsData);
        AppStore.addEventListener(ActionType.DELETE_AGENT, this._reloadAgentsData);
        AppStore.addEventListener(ActionType.ADD_AGENT, this._reloadAgentsData);
        AppStore.addEventListener(ActionType.UPDATE_AGENT, this._reloadAgentsData);

        AppStore.addEventListener(ActionType.PARTNERSHIPS_LOADED, this._reloadPartnershipsData);
        AppStore.addEventListener(ActionType.DELETE_PARTNERSHIP, this._reloadPartnershipsData);
        AppStore.addEventListener(ActionType.ADD_PARTNERSHIP, this._reloadPartnershipsData);
        AppStore.addEventListener(ActionType.UPDATE_PARTNERSHIP, this._reloadPartnershipsData);
    }
    componentWillUnmount()
    {
        AppStore.removeEventListener(ActionType.AGENTS_LOADED,this._reloadAgentsData);
        AppStore.removeEventListener(ActionType.DELETE_AGENT,this._reloadAgentsData);
        AppStore.removeEventListener(ActionType.ADD_AGENT,this._reloadAgentsData);
        AppStore.removeEventListener(ActionType.UPDATE_AGENT,this._reloadAgentsData);

        AppStore.removeEventListener(ActionType.DELETE_PARTNERSHIP,this._reloadPartnershipsData);
        AppStore.removeEventListener(ActionType.ADD_PARTNERSHIP,this._reloadPartnershipsData);
        AppStore.removeEventListener(ActionType.UPDATE_PARTNERSHIP,this._reloadPartnershipsData);
        AppStore.removeEventListener(ActionType.PARTNERSHIPS_LOADED,this._reloadPartnershipsData);
    }

    //Agents
    reloadAgentsData()
    {
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
        var string = "למחוק סוכן "
        var name = ""
        var agent = AppStore.getAgentAtIndex(rowIndex)
        name =  "'" + agent.name + " " + agent.familyName + "'"
        string = string + name + "?"

        swal({
                title: "הערה",
                text: string,
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "המשך",
                cancelButtonText: "ביטול",
                closeOnConfirm: true,
                closeOnCancel: true
            },
            function(isConfirm)
            {
                if (isConfirm)
                {
                    AppActions.deleteAgentAtIndex(rowIndex)
                    return
                }
            });
    }

    //Partnerships
    reloadPartnershipsData()
    {
        this.state.partnerships = AppStore.getPartnerships()
        this.setState(this.state)
    }

    onNewPartnership()
    {
        this.context.router.push('/app/agents-and-partnerships/partnership-page/' + (-1))
    }
    onDeletePartnershipsClicked(rowIndex)
    {
        var string = "למחוק שותפות "
        var names = ""
        var partnership = AppStore.getPartnershipAtIndex(rowIndex)
        for(var idIndex = 0; idIndex < partnership.agentsDetails.length ; idIndex++)
        {
            var agentData = AppStore.getAgent(partnership.agentsDetails[idIndex].idNumber)
            if(agentData != null)
            {
                names += agentData.name + " " + agentData.familyName
                if(idIndex < (partnership.agentsDetails.length-1))
                {
                    names += ", "
                }
            }
        }
        names =  "'" + names + "'"
        string = string + names + "?"
        swal({
                title: "הערה",
                text: string,
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "המשך",
                cancelButtonText: "ביטול",
                closeOnConfirm: true,
                closeOnCancel: true
            },
            function(isConfirm)
            {
                if (isConfirm)
                {
                    AppActions.deletePartnershipAtIndex(rowIndex)
                    return
                }
            });
    }
    onPartnershipClicked(rowIndex)
    {
        this.context.router.push('/app/agents-and-partnerships/partnership-page/'+rowIndex)
    }

    onChangeTab(i, value, tab, ev)
    {
        selectedTab = i
        this.setState(this.state)
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
                            <div className="vertical-spacer-20"/>
                            <Button className="shadow" onClick={this.onNewAgent.bind(this)} color="primary">{strings.newAgent}</Button>
                            <div className="agents-page-table">
                                <Table onRemoveRow={this.onDeleteAgentClicked.bind(this)} columns={agentsColumns} data={agentsData}/>
                            </div>
                        </div>

                    </Tab>
                    <Tab value="pane-2" label={strings.partnerships}>

                        <div className="agents-page-tab-container">
                            <div className="vertical-spacer-20"/>
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