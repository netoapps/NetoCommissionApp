import React from 'react';
import AuthService from '../services/auth-service'
import Tabs from 'muicss/lib/react/tabs'
import Tab from 'muicss/lib/react/tab'
import { strings } from '../constants/strings'
import Button from 'muicss/lib/react/button'
import Table from './table.jsx'
import AppStore from '../stores/data-store'

class AgentsAndPartnerships extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            loginData: AuthService.getLoginData(),
            selectedTab: 0,
            agentsData: AppStore.getAgents(),
            partnershipsData:AppStore.getPartnerships()
        };
    }
    onNewAgent()
    {
        this.context.router.push('/app/agents-and-partnerships/agent-page/new')
    }
    onNewPartnership()
    {
        this.context.router.push('/app/agents-and-partnerships/partnership-page/new')
    }

    onChangeTab(i, value, tab, ev)
    {
        this.state.selectedTab = i
        this.setState(this.state)
        console.log(arguments);
    }
    onAgentClicked(rowIndex)
    {
        var agentId = this.state.agentsData[rowIndex].idNumber
        this.context.router.push('/app/agents-and-partnerships/agent-page/'+agentId)
    }
    onPartnershipClicked(rowIndex)
    {
        //var agentId = this.state.agentsData[rowIndex].idNumber
        this.context.router.push('/app/agents-and-partnerships/partnership-page/new')
    }
    onDeleteAgentClicked(rowIndex)
    {
        console.log("onDeleteAgentClicked " + rowIndex)
    }

    onEditAgentClicked(rowIndex)
    {
        console.log("onEditAgentClicked " + rowIndex)
    }

    onDeletePartnershipsClicked(rowIndex)
    {
        console.log("onDeletePartnershipsClicked " + rowIndex)
    }

    onEditPartnershipsClicked(rowIndex)
    {
        console.log("onEditPartnershipsClicked " + rowIndex)
    }

    render () {

        var agentsColumns = [

            {
                title: "שם",
                key: "name",
                width: "col-33-33",
                type: 'read-only-button',
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
            },
            {
                title: "פעולות",
                key: "actions",
                width: "col-33-33",
                type: 'action',
                color: 'normal'
            }
        ]



        var deleteAgentAction = {name: "מחיקה", action: this.onDeleteAgentClicked.bind(this),color: "red"}
        var editAgentAction = {name: "עריכה", action: this.onEditAgentClicked.bind(this),color: "blue"}
        var agentsData = []
        for(var agentIndex = 0; agentIndex < this.state.agentsData.length; agentIndex++)
        {
            var agentData = {}

            agentData["name"] = this.state.agentsData[agentIndex].name + " " + this.state.agentsData[agentIndex].familyName
            agentData["idNumber"] = this.state.agentsData[agentIndex].idNumber
            agentData["status"] = this.state.agentsData[agentIndex].active ? "פעיל":"לא פעיל"
            agentData["actions"] = [editAgentAction,deleteAgentAction]
            agentsData.push(agentData)
        }

        var partnershipColumns = [

            {
                title: "שותפים",
                key: "names",
                width: "col-33-33",
                type: 'read-only-button',
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
            },
            {
                title: "פעולות",
                key: "actions",
                width: "col-33-33",
                type: 'action',
                color: 'normal'
            }
        ]

        var deletePartnershipsDataAction = {name: "מחיקה", action: this.onDeletePartnershipsClicked.bind(this),color: "red"}
        var editPartnershipsAction = {name: "עריכה", action: this.onEditPartnershipsClicked.bind(this),color: "blue"}
        var partnershipsData = []
        for(var partnershipIndex = 0; partnershipIndex < this.state.partnershipsData.length; partnershipIndex++)
        {
            var partnershipData = {}
            partnershipData["names"] = ""
            partnershipData["idNumbers"] = ""
            for(var idIndex = 0; idIndex < this.state.partnershipsData[partnershipIndex].partnersId.length ; idIndex++)
            {
                agentData = AppStore.getAgent(this.state.partnershipsData[partnershipIndex].partnersId[idIndex])
                if(agentData != null)
                {
                    partnershipData["names"] += (agentData.name + " " + agentData.familyName)
                    partnershipData["idNumbers"] += agentData.idNumber
                    if(idIndex < (this.state.partnershipsData[partnershipIndex].partnersId.length-1))
                    {
                        partnershipData["names"] += ", "
                        partnershipData["idNumbers"] += ", "
                    }
                }
            }
            partnershipData["status"] = this.state.partnershipsData[partnershipIndex].active ? "פעיל":"לא פעיל"
            partnershipData["actions"] = [editPartnershipsAction,deletePartnershipsDataAction]
            partnershipsData.push(partnershipData)
        }


        return (
            <div className="agents-page animated fadeIn">
                <Tabs onChange={this.onChangeTab.bind(this)} justified={true} initialSelectedIndex={this.state.selectedTab}>
                    <Tab value="pane-1" label={strings.agents}>

                        <div className="agents-page-tab-container">
                            <div className="agents-page-vertical-spacer"/>
                            <Button className="shadow" onClick={this.onNewAgent.bind(this)} color="primary">{strings.newAgent}</Button>
                            <div className="agents-page-vertical-spacer"/>
                            <div className="agents-page-table">
                                <Table columns={agentsColumns} data={agentsData}/>
                            </div>
                        </div>

                    </Tab>
                    <Tab value="pane-2" label={strings.partnerships}>

                        <div className="agents-page-tab-container">
                            <div className="agents-page-vertical-spacer"/>
                            <Button className="shadow" onClick={this.onNewPartnership.bind(this)} color="primary">{strings.newPartnership}</Button>
                            <div className="agents-page-vertical-spacer"/>
                            <div className="agents-page-table">
                                <Table columns={partnershipColumns} data={partnershipsData}/>
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