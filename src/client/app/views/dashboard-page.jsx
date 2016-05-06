import React from 'react';
import AuthService from '../services/auth-service'



function getMonthName(monthNum)
{
    var monthOptions = ["ינואר","פברואר","מרץ","אפריל","מאי","יוני","יולי","אוגוסט","ספטמבר","אוקטובר","נובמבר","דצמבר"];

    if(monthNum > 12 || monthNum < 1)
    {
        return monthOptions[0];
    }
    return monthOptions[monthNum - 1];
}

class DashboardDateSelect extends React.Component {

    constructor(props) {
        super(props);

        var date = new Date();
        var currentMonth = date.getMonth();
        var currentYear = date.getFullYear();

        this.state = {
            selectedMonth: getMonthName(currentMonth),
            selectedYear: currentYear.toString()
        }
    }
    onMonthChange(event)
    {
        event.preventDefault();
        if(event.target.value != this.state.selectedMonth)
        {
            this.setState({selectedMonth: event.target.value});
        }
    }
    onYearChange(event)
    {
        event.preventDefault();
        if(event.target.value != this.state.selectedYear)
        {
            this.setState({selectedYear: event.target.value});
        }
    }
    onLoadClick()
    {

    }
    render () {

        var monthOptions = [];
        for(var option = 1; option <= 12; option++)
        {
            var monthName = getMonthName(option)
            monthOptions[option] = <option key={option} value={monthName}>{monthName}</option>
        }

        var yearOptions = [];
        var date = new Date();
        var currentYear = date.getFullYear();
        currentYear = currentYear < 9999 ? currentYear:2050;
        option = 0;
        for(var startYear = 2010; startYear <= currentYear; startYear++)
        {
            var yearName = startYear.toString();
            yearOptions[option] = <option key={option} value={yearName}>{yearName}</option>
            option++;
        }

        return (
            <div className="dashboard-date-box hcontainer-no-wrap">
                <select onChange={this.onMonthChange.bind(this)} defaultValue={this.state.selectedMonth} >
                    {monthOptions}
                </select>
                <select onChange={this.onYearChange.bind(this)} defaultValue={this.state.selectedYear}>
                    {yearOptions}
                </select>
                <button className="" onClick={this.onLoadClick.bind(this)}>{"טען"}</button>
            </div>
        );
    }
}

class DashboardRankTable extends React.Component {

    constructor(props) {
        super(props);

    }
    render () {
        return (
            <div className="dashboard-rank-table shadow">
            </div>
        );
    }
}

class DashboardCommissionChangeChart extends React.Component {

    constructor(props) {
        super(props);

    }

    render () {
        return (
            <div className="dashboard-commission-change-chart shadow">
            </div>
        );
    }
}

class DashboardMonthTotalCommissions extends React.Component {

    constructor(props) {
        super(props);

    }

    render () {
        return (
            <div className="dashboard-month-total-commissions shadow">
            </div>
        );
    }
}

class DashboardMonthTotalAgents extends React.Component {

    constructor(props) {
        super(props);

    }

    render () {
        return (
            <div className="dashboard-month-total-agents shadow">
            </div>
        );
    }
}

class DashboardTotalInvestments extends React.Component {

    constructor(props) {
        super(props);

    }

    render () {
        return (
            <div className="dashboard-total-investments shadow">
            </div>
        );
    }
}

class DashboardMonthStats extends React.Component {

    constructor(props) {
        super(props);

    }

    render () {
        return (
                <div className="hcontainer-no-wrap">
                    <DashboardMonthTotalCommissions />
                    <DashboardMonthTotalAgents />
                </div>
        );
    }
}

class Dashboard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loginData: AuthService.getLoginData()
        };

    }

    render () {
        return (
            <div className="dashboard-page animated fadeIn">
                <DashboardDateSelect />
                <div className="hcontainer-no-wrap">
                    <DashboardRankTable  />
                    <div className="dashboard-horizontal-spacer"/>
                    <div className="dashboard-stats-container">
                        <div className="hcontainer-no-wrap dashboard-stats-container-top">
                            <DashboardMonthTotalCommissions />
                            <div className="dashboard-horizontal-spacer"/>
                            <DashboardMonthTotalAgents />
                        </div>
                        <div className="dashboard-vertical-spacer"/>
                        <DashboardTotalInvestments />
                    </div>
                </div>
                <div className="dashboard-vertical-spacer"/>
                <DashboardCommissionChangeChart />
            </div>
        );
    }
}




//<DashboardCommissionChangeChart />

//<div className="dashboard-page-section hcontainer-no-wrap">
//    <DashboardRankTable />
//    <DashboardCommissionChangeChart />
//</div>
//
//<div className="dashboard-page-section hcontainer-no-wrap">
//<DashboardMonthTotalCommissions />
//<DashboardTotalAgents />
//<DashboardTotalInvestments />
//</div>

//Important!! This adds the router object to context
Dashboard.contextTypes = {
    router: React.PropTypes.object.isRequired
}




export default Dashboard;