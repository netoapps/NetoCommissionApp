import React from 'react';
import { strings } from '../constants/strings'
import AuthService from '../services/auth-service'

class UserBox extends React.Component {

    constructor(props) {
        super(props);
    }
    onLogout(e)
    {
        e.preventDefault();
        this.props.onLogout()
    }
    render() {
        return (
            <div className="user-box hcontainer-no-wrap">
                <img className="user-avatar" src={this.props.loginData.gender == "0" ? "../public/images/avatar-male.png":"../public/images/avatar-female.png"} alt="" />
                <div className="user-box-info">
                    <div className="user-box-name">{this.props.loginData.name + " " + this.props.loginData.familyName}</div>
                    <button className="user-box-logout-button" onClick={this.onLogout.bind(this)}>{strings.disconnect}</button>
                </div>
            </div>
        );
    }
}



export default UserBox;