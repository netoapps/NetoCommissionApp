import React from 'react';
import { strings } from '../constants/strings'

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
        if(strings.agents === this.props.title)
        {
            className = "right-panel-item-button right-panel-item-button-agents"
        }

        return <div>
            <div className="right-panel-item">
                <button className={className} onClick={this.onClick.bind(this)}>{this.props.title}</button>
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
                <RightPanelItem title={strings.agents} onPanelItemClick={this.onPanelItemClick.bind(this)}/>
            </div>
        </div>
    }

}


export default RightPanel;