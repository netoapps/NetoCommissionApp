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
                    <img className="top-bar-logo" src="../public/images/neto-logo.png"/>
                    <UserBox loginData={this.props.loginData} onLogout={this.props.onLogout}/>
                </div>
            </div>
        </div>
    }
}


export default TopBar;