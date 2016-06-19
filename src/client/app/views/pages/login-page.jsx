import React from 'react';
import AuthService from '../../services/auth-service'
import { strings } from '../../constants/strings'

export default class Login extends React.Component {

    constructor() {
        super()
        this.state = {
            username: '',
            password: ''
        };
        this.errorMessage = ""
    }

    login(e)
    {
        e.preventDefault();

        this.state.email = this.refs.email.value;
        this.state.password = this.refs.password.value;
        this.errorMessage = "";
        this.errorMessageClassName = "";
        AuthService.login(this.state.email, this.state.password, ((loggedIn) =>
        {
            if(loggedIn)
            {
                this.context.router.push('/app/dashboard')
            }
            else
            {
                this.errorMessage = strings.loginErrorMessage
                this.errorMessageClassName = "login-page-alert";
            }
        }).bind(this))
    }

    render() {
        return (
            <div className="login-page animated fadeIn">
                <div className="login-page-container login-page-center">
                    <div className="login-page-neto-logo-container">
                        <img className="login-page-neto-logo" src="./public/images/neto-logo.png"/>
                    </div>
                    <div className="login-page-neto-doc-name">{strings.appName}</div>
                    <div className={this.errorMessageClassName}>{this.errorMessage}</div>
                    <form className="left-align">
                        <div>
                            <input type="text" className="login-page-input" id="email" ref="email" placeholder={strings.email}/>
                        </div>
                        <div>
                            <input type="password" className="login-page-input" id="password" ref="password" placeholder={strings.password}/>
                        </div>
                        <button type="submit" className="login-page-button" onClick={this.login.bind(this)}>{strings.connect}</button>
                    </form>
                    <div className="login-page-need-account-text">
                        <p>{strings.needAccount}<a href="/user-signup-request">&nbsp;{strings.sendRegisterRequest}</a></p>
                    </div>
                </div>
            </div>
        );
    }
}

//Important!! This adds the router object to context
Login.contextTypes = {
    router: React.PropTypes.object.isRequired
}

