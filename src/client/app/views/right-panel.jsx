import React from 'react';
import { strings } from '../constants/strings'
import FlatRippleButton from './common/FlatRippleButton.jsx'
import Button from 'muicss/lib/react/button'

class RightPanelItem extends React.Component {

    constructor(props) {
        super(props);
    }
    onClick()
    {
        this.props.onPanelItemClick(this.props.title)
    }
    render() {

        var className = ""
        if(strings.dashboard === this.props.title)
        {
            className = "right-panel-item-button right-panel-item-button-dashboard"
        }
        if(strings.commissions === this.props.title)
        {
            className = "right-panel-item-button right-panel-item-button-commissions"
        }
        if(strings.agentsAndPartnerships === this.props.title)
        {
            className = "right-panel-item-button right-panel-item-button-agents"
        }

        return <div>
            <div className="right-panel-item">
                <FlatRippleButton className={className} onClick={this.onClick.bind(this)}>{this.props.title}</FlatRippleButton>
            </div>
        </div>
    }
}

class RightPanel extends React.Component {

    constructor(props) {
        super(props);
    }
    onPanelItemClick(item)
    {
        this.props.onPanelItemClick(item)
    }
    render() {
        return <div>
            <div className="fixed right-panel animated fadeInRight">
                <div className="top-bar-logo-container">
                    <img className="top-bar-logo" src="../public/images/neto-logo.png"/>
                </div>
                <RightPanelItem title={strings.dashboard} onPanelItemClick={this.onPanelItemClick.bind(this)}/>
                <RightPanelItem title={strings.commissions} onPanelItemClick={this.onPanelItemClick.bind(this)}/>
                <RightPanelItem title={strings.agentsAndPartnerships} onPanelItemClick={this.onPanelItemClick.bind(this)}/>
            </div>
        </div>
    }

}


export default RightPanel;