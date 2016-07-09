import React from 'react';
import Table from './../common/table.jsx';
import AppActions from '../../actions/app-actions'
import AppStore from '../../stores/data-store'
import { strings } from '../../constants/strings'
import MonthYearBox from './../common/month-year-box.jsx'
import {getMonthName,getMonthNumber,getMonths} from './../common/month-year-box.jsx'

class AgentSalaryPage extends React.Component {

    constructor(props) {
        super(props);

        var date = new Date()
        var currentMonth = getMonthName(date.getMonth().toString());
        var currentYear = date.getFullYear().toString();

        this.state = {
            agent: AppStore.getAgent(this.props.params.agentId),
            selectedMonth: currentMonth,
            selectedYear: currentYear
        }
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

    render () {




        return (
            <div className="agent-salary-page animated fadeIn">
                <MonthYearBox month={this.state.selectedMonth} year={this.state.selectedYear}
                              onMonthChange={this.onMonthChange.bind(this)}
                              onYearChange={this.onYearChange.bind(this)}/>
                <div className="hcontainer-no-wrap">
                    <div className="agent-salary-page-total-salary-box shadow">
                        <div className="agent-salary-page-box-title">{strings.totalSalary}</div>
                        <div className="agent-salary-page-box-value blue"><small>{"₪"}&nbsp;</small><b>{2342342}</b></div>
                    </div>
                    <div className="horizontal-spacer-10"/>
                    <div className="agent-salary-page-total-investments-box shadow">
                    </div>
                </div>
            </div>
        );
    }
}

//Important!! This adds the router object to context
AgentSalaryPage.contextTypes = {
    router: React.PropTypes.object.isRequired
}

export default AgentSalaryPage;