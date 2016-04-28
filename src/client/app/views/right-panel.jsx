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
        return <div>
            <div className="right-panel-item">
                <button className="right-panel-item-button" onClick={this.onClick.bind(this)}>{this.props.title}</button>
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
            <div className="fixed right-panel">
                <RightPanelItem title={strings.dashboard} onPanelItemClick={this.onPanelItemClick.bind(this)}/>
                <RightPanelItem title={strings.commissions} onPanelItemClick={this.onPanelItemClick.bind(this)}/>
                <RightPanelItem title={strings.agents} onPanelItemClick={this.onPanelItemClick.bind(this)}/>
            </div>
        </div>
    }

}


export default RightPanel;