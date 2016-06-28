import React from 'react';
import Table from './../common/table.jsx';
import AppActions from '../../actions/app-actions'
import AppStore from '../../stores/data-store'
import {ActionType} from '../../actions/app-actions.js'
import Input from '../../../../../node_modules/muicss/lib/react/input';
import { strings } from '../../constants/strings'
import {Partnership,PartnershipPaymentDetails,PartnershipAgentDetails} from '../../model/partnership.js';
import FixedWidthDropdown from './../common/fixed-width-dropdown.jsx';
import Dropdown from 'muicss/lib/react/dropdown';
import DropdownItem from 'muicss/lib/react/dropdown-item';
import Button from 'muicss/lib/react/button'

class PartnershipPage extends React.Component {

    constructor(props) {
        super(props);

        var partnership = null
        var isNewPartnership = true
        if (this.props.params.index != "-1")
        {
            isNewPartnership = false
            partnership = new Partnership(AppStore.getPartnershipAtIndex(this.props.params.index))
        }
        else
        {
            partnership = new Partnership()
        }

        this.state = {
            isNewPartnership: isNewPartnership,
            partnershipIndex: this.props.params.index,
            partnership: partnership
        };

    }
    onAgentNameChange(index,value)
    {
        this.state.partnership.paymentsDetails[index].agentPart = value
        this.setState(this.state)
    }
    onAgentFamilyChange(index,value)
    {
        this.state.partnership.paymentsDetails[index].agentPart = value
        this.setState(this.state)
    }
    onAgentIdNumberChange(index,value)
    {
        this.state.partnership.paymentsDetails[index].agentPart = value
        this.setState(this.state)
    }
    onAgentPartChange(index,value)
    {
        this.state.partnership.paymentsDetails[index].agentPart = value
        this.setState(this.state)
    }

    onDeleteAgentRowClicked(rowIndex)
    {
        this.state.partnership.agentsDetails.splice(rowIndex, 1)
        this.setState(this.state)
    }

    onActiveChange(item)
    {
        if(item.props.value == strings.active)
        {
            this.state.partnership.active = true
            this.setState(this.state)
        }
        else
        {
            this.state.partnership.active = false
            this.setState(this.state)
        }
    }

    onNewAgentRow()
    {
        this.state.partnership.agentsDetails.push(new PartnershipAgentDetails())
        this.setState(this.state)
    }

    render () {

        var agentsTableColumns = [
            {
                title: "מזהה",
                key: "idNumber",
                width: "col-33-33",
                type: 'input',
                color: 'normal',
                action: this.onAgentIdNumberChange.bind(this)
            },
            {
                title: "שם פרטי",
                key: "name",
                width: "col-33-33",
                type: 'read-only',
                color: 'normal'
            },
            {
                title: "שם משפחה",
                key: "familyName",
                width: "col-33-33",
                type: 'read-only',
                color: 'normal'
            },
            {
                title: "חלק סוכן %",
                key: "part",
                width: "col-33-33",
                type: 'input',
                color: 'normal',
                action: this.onAgentPartChange.bind(this)
            }
        ]

        var agentsData = []

        for(var index = 0; index < this.state.partnership.agentsDetails.length ; index++)
        {
            var agentDetails = this.state.partnership.agentsDetails[index]
            var agent = AppStore.getAgent(agentDetails.idNumber)
            if (agent != null)
            {
                agentsData.push({
                    name: agent.name,
                    familyName: agent.familyName,
                    idNumber: agentDetails.idNumber,
                    part: agentDetails.part
                })
            }
            else
            {
                agentsData.push({
                    name: "",
                    familyName: "",
                    idNumber: "",
                    part: ""
                })
            }
         }

        var activeStates = []
        var selectedActiveState = this.state.partnership.active ? strings.active:strings.notActive
        activeStates.push(<DropdownItem onClick={this.onActiveChange.bind(this)} value={strings.active} key={0}>{strings.active}</DropdownItem>)
        activeStates.push(<DropdownItem onClick={this.onActiveChange.bind(this)} value={strings.notActive} key={1}>{strings.notActive}</DropdownItem>)

        return (
            <div className="page animated fadeIn">
                <div className="hcontainer-no-wrap">
                    <div className="page-title">{strings.partnershipPageDetails}</div>
                    <div className="page-form-horizontal-spacer-full"/>
                    <div className="page-active-box"><FixedWidthDropdown shadow label={selectedActiveState} alignMenu="right" >
                        {activeStates}
                    </FixedWidthDropdown></div>
                </div>
                <Button className="shadow" onClick={this.onNewAgentRow.bind(this)} color="primary">{strings.newAgent}</Button>
                <div className="page-form-table">
                    <Table onRemoveRow={this.onDeleteAgentRowClicked.bind(this)} columns={agentsTableColumns} data={agentsData}/>
                </div>
            </div>
        );
    }
}

//Important!! This adds the router object to context
PartnershipPage.contextTypes = {
    router: React.PropTypes.object.isRequired
}

export default PartnershipPage;