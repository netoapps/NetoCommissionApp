import React from 'react';

import { strings } from '../../../constants/strings'
import Button from 'muicss/lib/react/button'
import Table from '../../common/table.jsx'
import AppStore from '../../../stores/data-store'
import {getMonthName,getMonthNumber,getMonths} from '../../common/month-year-box.jsx'
import MonthYearBox from '../../common/month-year-box.jsx'


class Salaries extends React.Component {

    constructor(props) {
        super(props);

        var date = new Date()
        var currentMonth = getMonthName(date.getMonth().toString());
        var currentYear = date.getFullYear().toString();

        this.state = {
            agents: AppStore.getAgents(),
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
            // this.props.onMonthChange(month)
        }
    }
    onYearChange(year)
    {
        if(year != this.state.selectedYear)
        {
            this.state.selectedYear = year;
            this.setState(this.state);
            // this.props.onYearChange(year)
        }
    }

    onAgentClicked(rowIndex)
    {
        this.context.router.push('/app/agents-and-partnerships/agent-page/'+rowIndex)
    }
    //Salary
    onSalaryClicked(rowIndex)
    {
        this.context.router.push('/app/agents-and-partnerships/agent-salary-page/'+rowIndex)
    }

    onRowClick(index,rowData)
    {
        this.context.router.push('/app/agents-and-partnerships/agent-salary-page/'+index)
    }
    render () {

        var agentsColumns = [

            {
                title: "שם",
                key: "name",
                width: "col-33-33",
                type: 'read-only',
                color: 'blue'
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
                title: "שכר",
                key: "salary",
                width: "col-33-33",
                type: 'read-only',
                format: 'currency',
                color: 'blue'
            }
        ]

        var agentsData = []
        for(var agentIndex = 0; agentIndex < this.state.agents.length; agentIndex++)
        {
            var agentData = {}

            agentData["name"] = this.state.agents[agentIndex].name + " " + this.state.agents[agentIndex].familyName
            agentData["salary"] = "0"
            agentData["idNumber"] = this.state.agents[agentIndex].idNumber
            agentData["status"] = this.state.agents[agentIndex].active ? "פעיל":"לא פעיל"
            agentsData.push(agentData)
        }

        return (
            <div className="salaries-page animated fadeIn ">

                <div className="hcontainer-no-wrap">
                    <MonthYearBox month={this.state.selectedMonth} year={this.state.selectedYear}
                                  onMonthChange={this.onMonthChange.bind(this)}
                                  onYearChange={this.onYearChange.bind(this)}/>
                </div>
                <div className="salaries-page-table shadow">
                    <Table onRowClick={this.onRowClick.bind(this)} columns={agentsColumns} data={agentsData}/>
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