import React from 'react';
import AuthService from '../services/auth-service'

class Dashboard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loginData: AuthService.getLoginData()
        };

    }

    render () {
        return (
            <div className="dashboard-page">
                Dashboard
            </div>
        );
    }
}

//Important!! This adds the router object to context
Dashboard.contextTypes = {
    router: React.PropTypes.object.isRequired
}

export default Dashboard;