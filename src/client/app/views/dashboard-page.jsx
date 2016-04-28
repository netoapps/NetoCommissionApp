import React from 'react';
import AuthService from '../services/auth-service'

class DashboardRankTable extends React.Component {

    constructor(props) {
        super(props);

    }

    render () {
        return (
            <div className="dashboard-large-box dashboard-rank-table shadow">
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
            <div className="dashboard-large-box dashboard-commission-change-chart shadow">
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
            <div className="dashboard-small-box dashboard-month-total-commissions shadow">
            </div>
        );
    }
}

class DashboardTotalAgents extends React.Component {

    constructor(props) {
        super(props);

    }

    render () {
        return (
            <div className="dashboard-small-box dashboard-total-agents shadow">
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
            <div className="dashboard-small-box dashboard-total-investments shadow">
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

                <div className="dashboard-page-section hcontainer-no-wrap">
                    <DashboardRankTable />
                    <DashboardCommissionChangeChart />
                </div>

                <div className="dashboard-page-section hcontainer-no-wrap">
                    <DashboardMonthTotalCommissions />
                    <DashboardTotalAgents />
                    <DashboardTotalInvestments />
                </div>

            </div>
        );
    }
}

//Important!! This adds the router object to context
Dashboard.contextTypes = {
    router: React.PropTypes.object.isRequired
}

export default Dashboard;