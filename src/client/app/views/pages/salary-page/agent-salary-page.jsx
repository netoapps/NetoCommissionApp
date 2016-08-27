import React from 'react';
import SalaryPage from './salary-page.jsx';
import AppStore from '../../../stores/data-store'

class AgentSalaryPage extends SalaryPage {

    constructor(props) {
        super(props);

        var agent = AppStore.getAgent(this.props.params.idNumber)
        this.state.context = {
            type: "agent",
            id: agent.idNumber,
            fullName: agent.name + " " + agent.familyName
        }
    }

    render () {
        return super.render()
    }
}

//Important!! This adds the router object to context
AgentSalaryPage.contextTypes = {
    router: React.PropTypes.object.isRequired
}

export default AgentSalaryPage;