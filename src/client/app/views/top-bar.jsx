import React from 'react';
import UserBox from './user-box.jsx';

class TopBar extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return <div>
            <div className="fixed top-bar animated fadeInDown">
                <div className="top-bar-container hcontainer-no-wrap">
                    <UserBox loginData={this.props.loginData} onLogout={this.props.onLogout}/>
                    <div className="top-bar-title">{this.props.pageTitle}</div>
                </div>
            </div>
        </div>
    }
}


export default TopBar;