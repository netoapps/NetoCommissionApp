import React from 'react';
import AuthService from '../services/auth-service'

class DashboardDateSelect extends React.Component {

    constructor(props) {
        super(props);

    }

    render () {
        return (
            <div className="dashboard-date-box shadow">
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