import React from 'react';
import AuthService from '../services/auth-service'
import Tabs from 'muicss/lib/react/tabs'
import Tab from 'muicss/lib/react/tab'
import { strings } from '../constants/strings'
import Button from 'muicss/lib/react/button'
import Table from './table.jsx'

class Agents extends React.Component {

    constructor(props) {
        super(props);

        var agentsData = [
            {name: "קרין בוזלי לוי", idNumber: "123456789", status: "פעיל"},
            {name: "עידן כץ", idNumber: "987654321", status: "פעיל"},
            {name: "תומר", idNumber: "1212121212", status: "לא פעיל"}
        ]

        var partnershipsData = [
            {names: "קרין בוזלי לוי, ויטלי", idNumbers: "123456789, 3534534543", status: "פעיל"},
            {names: "עידן כץ, קרין", idNumbers: "3453444,48765432", status: "פעיל"},
            {names: "תומר, מסי", idNumbers: "234234345,3534543", status: "לא פעיל"}
        ]


        this.state = {
            loginData: AuthService.getLoginData(),
            selectedTab: 0,
            agentsData:agentsData,
            partnershipsData:partnershipsData
        };
    }
    onNewAgent()
    {
        this.context.router.push('/app/new-agent')
    }
    onNewPartnership()
    {
        this.context.router.push('/app/new-partnership')
    }

    onChangeTab(i, value, tab, ev)
    {
        this.state.selectedTab = i
        this.setState(this.state)
        console.log(arguments);
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
        var agentsDataWithActions = []
        for(var file = 0; file < this.state.agentsData.length; file++)
        {
            var agentData = this.state.agentsData[file]
            agentData["actions"] = [editAgentAction,deleteAgentAction]
            agentsDataWithActions.push(agentData)
        }


        var partnershipColumns = [

            {
                title: "שותפים",
                key: "names",
                width: "col-33-33",
                type: 'read-only',
                color: 'normal'
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
        var partnershipsDataWithActions = []
        for(var file = 0; file < this.state.partnershipsData.length; file++)
        {
            var partnershipData = this.state.partnershipsData[file]
            partnershipData["actions"] = [editPartnershipsAction,deletePartnershipsDataAction]
            partnershipsDataWithActions.push(partnershipData)
        }
        

        return (
            <div className="agents-page animated fadeIn">
                <Tabs onChange={this.onChangeTab.bind(this)} justified={true} initialSelectedIndex={this.state.selectedTab}>
                    <Tab value="pane-1" label={strings.agents}>

                        <div className="agents-page-tab-container">
                            <div className="agents-page-vertical-spacer"/>
                            <Button className="shadow" onClick={this.onNewAgent.bind(this)} color="primary">{strings.createNewAgent}</Button>
                            <div className="agents-page-vertical-spacer"/>
                            <div className="agents-page-table">
                                <Table columns={agentsColumns} data={agentsDataWithActions}/>
                            </div>
                        </div>

                    </Tab>
                    <Tab value="pane-2" label={strings.partnerships}>

                        <div className="agents-page-tab-container">
                            <div className="agents-page-vertical-spacer"/>
                            <Button className="shadow" onClick={this.onNewAgent.bind(this)} color="primary">{strings.createNewPartnership}</Button>
                            <div className="agents-page-vertical-spacer"/>
                            <div className="agents-page-table">
                                <Table columns={partnershipColumns} data={partnershipsDataWithActions}/>
                            </div>
                        </div>

                    </Tab>
                </Tabs>
            </div>
        );
    }
}

//Important!! This adds the router object to context
Agents.contextTypes = {
    router: React.PropTypes.object.isRequired
}

export default Agents;