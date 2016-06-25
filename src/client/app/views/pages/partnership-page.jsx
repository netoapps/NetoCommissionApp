import React from 'react';
import Table from './../common/table.jsx';
import AppActions from '../../actions/app-actions'
import AppStore from '../../stores/data-store'
import {ActionType} from '../../actions/app-actions.js'
import Input from '../../../../../node_modules/muicss/lib/react/input';
import { strings } from '../../constants/strings'

class PartnershipPage extends React.Component {

    constructor(props) {
        super(props);


    }

    render () {

        return (
            <div className="partnership-page animated fadeIn">

            </div>
        );
    }
}

//Important!! This adds the router object to context
PartnershipPage.contextTypes = {
    router: React.PropTypes.object.isRequired
}

export default PartnershipPage;