import React from 'react';

import { strings } from '../../../constants/strings'
import Button from 'muicss/lib/react/button'
import Table from '../../common/table.jsx'
import AppStore from '../../../stores/data-store'
import {getMonthName,getMonthNumber,getMonths} from '../../common/month-year-box.jsx'
import MonthYearBox from '../../common/month-year-box.jsx'
import Tabs from 'muicss/lib/react/tabs'
import Tab from 'muicss/lib/react/tab'

var salariesSelectedTab = 0

class Salaries extends React.Component {

    constructor(props) {
        super(props);

        var lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth()-1);

        var currentMonth = getMonthName(lastMonth.getMonth().toString());
        var currentYear = lastMonth.getFullYear().toString();

        this.state = {
            agents: AppStore.getAgents(),
            partnerships: AppStore.getPartnerships(),
            selectedMonth: currentMonth,
            selectedYear: currentYear
        };
    }
    componentDidMount()
    {
    }
    componentWillUnmount()
    {
    }

    onMonthChange(month)
    {
        if(month != this.state.selectedMonth)
        {
            this.state.selectedMonth = month;
            this.setState(this.state);
        }
    }
    onYearChange(year)
    {
        if(year != this.state.selectedYear)
        {
            this.state.selectedYear = year;
            this.setState(this.state);
        }
    }

    onAgentRowClick(index,rowData)
    {
        this.context.router.push('/app/agents-and-partnerships/agent-salary-page/'+rowData.idNumber)
    }
    onPartnershipRowClick(index,rowData)
    {
        this.context.router.push('/app/agents-and-partnerships/partnership-salary-page/'+rowData.partnershipId)
    }
    //UI
    onChangeTab(i, value, tab, ev)
    {
        if(!isNaN(i))
        {
            salariesSelectedTab = i
            this.setState(this.state)
        }
     }

    render () {

        var agentsColumns = [

            {
                title: "שם",
                key: "name",
                width: "33%",
                type: 'read-only',
                color: 'blue',
                searchBox: true
            },
            {
                title: "מזהה",
                key: "idNumber",
                width: "33%",
                type: 'read-only',
                color: 'normal',
                searchBox: true
            },
            {
                title: "סטטוס",
                key: "status",
                width: "33%",
                type: 'read-only',
                color: 'normal',
                searchBox: true

            }
        ]

        var partnershipsColumns = [

            {
                title: "שותפים",
                key: "names",
                width: "33%",
                type: 'read-only',
                color: 'normal',
                searchBox: true

            },
            {
                title: "מזהה",
                key: "idNumbers",
                width: "33%",
                type: 'read-only',
                color: 'normal',
                searchBox: true
            },
            {
                title: "סטטוס",
                key: "status",
                width: "33%",
                type: 'read-only',
                color: 'normal',
                searchBox: true
            }
        ]

        var agentsData = []
        for(var agentIndex = 0; agentIndex < this.state.agents.length; agentIndex++)
        {
            if(!this.state.agents[agentIndex].deleted) {
                var agentData = {}
                agentData["name"] = this.state.agents[agentIndex].name + " " + this.state.agents[agentIndex].familyName
                agentData["idNumber"] = this.state.agents[agentIndex].idNumber
                agentData["status"] = this.state.agents[agentIndex].active ? "פעיל" : "לא פעיל"
                agentsData.push(agentData)
            }
        }

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
            partnershipData["partnershipId"] = this.state.partnerships[partnershipIndex]._id
            partnershipsData.push(partnershipData)
        }

        return (
            <div className="salaries-page animated fadeIn ">

                <div className="hcontainer-no-wrap">
                    <MonthYearBox month={this.state.selectedMonth} year={this.state.selectedYear}
                                  onMonthChange={this.onMonthChange.bind(this)}
                                  onYearChange={this.onYearChange.bind(this)}/>
                </div>
                <div className="vertical-spacer-10"/>

                <div className="salaries-page-tabs-container shadow">
                    <Tabs onChange={this.onChangeTab.bind(this)} justified={true} initialSelectedIndex={salariesSelectedTab}>

                            <Tab value="pane-1" label={strings.agents}>
                                <div className="vertical-spacer-10"/>
                                <div className="salaries-page-tab-container">
                                    <Table  heightClass="salaries-page-tab-container-height"
                                            onRowClick={this.onAgentRowClick.bind(this)}
                                            columns={agentsColumns}
                                            data={agentsData}/>
                                </div>
                            </Tab>

                            <Tab value="pane-2" label={strings.partnerships}>
                                <div className="vertical-spacer-10"/>
                                <div className="salaries-page-tab-container">
                                    <Table  heightClass="salaries-page-tab-container-height"
                                            onRowClick={this.onPartnershipRowClick.bind(this)}
                                            columns={partnershipsColumns}
                                            data={partnershipsData}/>
                                </div>
                            </Tab>
                    </Tabs>
                </div>
            </div>
        );
    }
}



//Important!! This adds the router object to context
Salaries.contextTypes = {
    router: React.PropTypes.object.isRequired
}

export default Salaries;