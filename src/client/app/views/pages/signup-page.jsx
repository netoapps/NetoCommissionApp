import React from 'react';
import AuthService from '../../services/auth-service'
import { strings } from '../../constants/strings'

export default class Signup extends React.Component {

    constructor() {
        super()
        this.state = {
            username: '',
            password: '',
            name: '',
            familyName: ''
        };
    }

    register(e) {
        e.preventDefault();

        var usernameInput = this.refs.username;
        var passwordInput = this.refs.password;
        var nameInput = this.refs.name;
        var familyNameInput = this.refs.familyName;
        this.state.username = usernameInput.value;
        this.state.password = passwordInput.value;
        this.state.name = nameInput.value;
        this.state.familyName = familyNameInput.value;

        if((this.state.username === "") || (this.state.password === "") ||
            (this.state.name === "") || (this.state.familyName === ""))
        {
            swal({
                title: "שגיאה",
                text: "חובה למלא את כל השדות",
                type: "error",
                showCancelButton: false,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "סגור",
                closeOnConfirm: true,
                showLoaderOnConfirm: false
            });
            return
        }

        AuthService.signup(this.state.username, this.state.password,this.state.name,this.state.familyName, (response) => {
            if(response.authenticated)
            {
                this.context.router.push('/app/dashboard')
            }
            else
            {
                console.log("signup error")
            }
        })
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
                            <input type="text" className="login-page-input" id="name" ref="name" placeholder={strings.name}/>
                        </div>
                        <div>
                            <input type="text" className="login-page-input" id="familyName" ref="familyName" placeholder={strings.familyName}/>
                        </div>
                        <div>
                            <input type="text" className="login-page-input" id="email" ref="username" placeholder={strings.email}/>
                        </div>
                        <div>
                            <input type="password" className="login-page-input" id="password" ref="password" placeholder={strings.password}/>
                        </div>
                        <button type="submit" className="login-page-button" onClick={this.register.bind(this)}>{strings.register}</button>
                    </form>
                </div>
            </div>
        );
    }
}

//Important!! This adds the router object to context
Signup.contextTypes = {
    router: React.PropTypes.object.isRequired
}
