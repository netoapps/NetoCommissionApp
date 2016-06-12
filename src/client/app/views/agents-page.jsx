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
        this.state = {
            loginData: AuthService.getLoginData(),
            selectedTab: 0
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
            }
        ]

        var agentsData = [
            {name: "קרין בוזלי לוי", idNumber: "123456789", status: "פעיל"},
            {name: "עידן כץ", idNumber: "987654321", status: "פעיל"},
            {name: "תומר", idNumber: "1212121212", status: "לא פעיל"}
        ]


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
            }
        ]
        var partnershipData = [
            {names: "קרין בוזלי לוי, ויטלי", idNumbers: "123456789, 3534534543", status: "פעיל"},
            {names: "עידן כץ, קרין", idNumbers: "3453444,48765432", status: "פעיל"},
            {names: "תומר, מסי", idNumbers: "234234345,3534543", status: "לא פעיל"}
        ]


        //    <div className="agents-page-tab-container">
        //    <div className="agents-page-vertical-spacer"/>
        //    <Button className="shadow" onClick={this.onNewPartnership.bind(this)} color="primary">{strings.createNewPartnership}</Button>
        //<div className="agents-page-vertical-spacer"/>
        //
        //
        //<div className="agents-page-table">
        //    <Table columns={columns} data={data}/>
        //    </div>
        //    </div>

        return (
            <div className="agents-page animated fadeIn">
                <Tabs onChange={this.onChangeTab.bind(this)} justified={true} initialSelectedIndex={this.state.selectedTab}>
                    <Tab value="pane-1" label={strings.agents}>

                        <div className="agents-page-tab-container">
                            <div className="agents-page-vertical-spacer"/>
                            <Button className="shadow" onClick={this.onNewAgent.bind(this)} color="primary">{strings.createNewAgent}</Button>
                            <div className="agents-page-vertical-spacer"/>
                            <div className="agents-page-table">
                                <Table columns={agentsColumns} data={agentsData}/>
                            </div>
                        </div>

                    </Tab>
                    <Tab value="pane-2" label={strings.partnerships}>

                        <div className="agents-page-tab-container">
                            <div className="agents-page-vertical-spacer"/>
                            <Button className="shadow" onClick={this.onNewAgent.bind(this)} color="primary">{strings.createNewPartnership}</Button>
                            <div className="agents-page-vertical-spacer"/>
                            <div className="agents-page-table">
                                <Table columns={partnershipColumns} data={partnershipData}/>
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