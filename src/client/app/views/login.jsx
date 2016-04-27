import React from 'react';
import AuthService from '../services/auth-service'

export default class Login extends React.Component {

    constructor() {
        super()
        this.state = {
            username: '',
            password: ''
        };
    }

    handleLogin(loggedIn, message)
    {

    }

    login(e)
    {
        e.preventDefault();

        this.state.email = this.refs.email.value;
        this.state.password = this.refs.password.value;

        AuthService.login(this.state.email, this.state.password, ((loggedIn, message) =>
        {
            if(loggedIn)
            {
                console.log("logged in!!")

                //const { location } = this.props
                //
                //if (location.state && location.state.nextPathname)
                //{
                //    this.props.router.replace(location.state.nextPathname)
                //}
                //else
                //{
                //    //this.props.router.replace('/dashboard')
                //    this.context.router.push('/dashboard')
                //}
                this.context.router.push('/dashboard')
            }
            else
            {
                alert("There's an error logging in - " + message);
            }
        }).bind(this))
    }

    render() {
        return (
            <div className="login">
                <h1>Login</h1>
                <form role="form">
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input type="text" className="form-control" id="email" ref="email" placeholder="Email" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" className="form-control" id="password" ref="password" placeholder="Password" />
                    </div>
                    <button type="submit" className="btn btn-default" onClick={this.login.bind(this)}>Submit</button>
                </form>
            </div>
        );
    }
}

//Important!! This adds the router object to context
Login.contextTypes = {
    router: React.PropTypes.object.isRequired
}


