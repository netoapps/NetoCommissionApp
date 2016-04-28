import React from 'react';
import AuthService from '../services/auth-service'

class Agents extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loginData: AuthService.getLoginData()
        };

    }

    render () {
        return (
            <div className="agents-page">
                Agents
            </div>
        );
    }
}

//Important!! This adds the router object to context
Agents.contextTypes = {
    router: React.PropTypes.object.isRequired
}

export default Agents;