import React from 'react';
import AuthService from '../services/auth-service'

class Commissions extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loginData: AuthService.getLoginData()
        };

    }

    render () {
        return (
            <div className="commissions-page animated fadeIn">
                Commissions
            </div>
        );
    }
}

//Important!! This adds the router object to context
Commissions.contextTypes = {
    router: React.PropTypes.object.isRequired
}

export default Commissions;