import React from 'react';
import SalaryPage from './salary-page.jsx';
import AppStore from '../../../stores/data-store'

class PartnershipSalaryPage extends SalaryPage {

    constructor(props) {
        super(props);

        var partnership = AppStore.getPartnership(this.props.params.partnershipId)
        this.state.context = {
            type: "partnership",
            id: partnership._id,
            fullName: ""
        }
        for(var idIndex = 0; idIndex < partnership.agentsDetails.length ; idIndex++)
        {
            var agentData = AppStore.getAgent(partnership.agentsDetails[idIndex].idNumber)
            if(agentData != null)
            {
                this.state.context.fullName += agentData.name + " " + agentData.familyName
                if(idIndex < (partnership.agentsDetails.length-1))
                {
                    this.state.context.fullName += ", "
                }
            }
        }
    }

    render () {
       return super.render()
    }
}

//Important!! This adds the router object to context
PartnershipSalaryPage.contextTypes = {
    router: React.PropTypes.object.isRequired
}

export default PartnershipSalaryPage;