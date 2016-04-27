import React from 'react';
import {render} from 'react-dom';
import { browserHistory, Router, Route, Link } from 'react-router'
//import AppDispatcher from './dispatcher/app-dispatcher';
//import AppContainerView from './views/app-container-view.jsx';
import AuthService from './services/auth-service'
import Login from './views/login.jsx'
import Signup from './views/signup.jsx'
import Dashboard from './views/dashboard.jsx'
//import AppActions from './actions/app-actions';

//AppDispatcher.dispatch('APPINIT');

function requireAuth(nextState, replace)
{
    if (!AuthService.loggedIn())
    {
        replace({
            pathname: '/',
            state: { nextPathname: nextState.location.pathname }
        })
    }
}

class App extends React.Component {

    constructor() {
        super()
        this.state = {
            loggedIn: AuthService.loggedIn()
        };
    }
    updateAuth(loggedIn)
    {
        this.setState(
            {
            loggedIn: loggedIn
        })
    }
    componentWillMount() {
        AuthService.onChange = this.updateAuth.bind(this)
        AuthService.login()
    }
    render()
    {
        return (
            <div>
                { this.state.loggedIn ? (this.props.children) : (<Login />)}
            </div>
        );
    }
}


render((
    <Router history={browserHistory}>
        <Route path="/" component={App}>
            <Route path="login" component={Login} />
            <Route path="signup" component={Signup} />
            <Route path="dashboard" component={Dashboard} onEnter={requireAuth} />
        </Route>
    </Router>
), document.getElementById('content'))




//let jwt = localStorage.getItem('jwt');
//if (jwt) {
//    AppActions.loginUser(jwt);
//}

//render((
//    <Router history={browserHistory}>
//        <Route handler={AppView}>
//            <Route name="login" handler={Login}/>
//            <Route name="signup" handler={Signup}/>
//            <Route name="dashboard" path="/" handler={Dashboard}/>
//        </Route>
//    </Router>
//), document.getElementById('app-content'));

//var routes = (
//
//);

//var router = new Router.create({routes});
//RouterContainer.set(router);
//
//RouterContainer.set(router);



//router.run(routes,function (Handler) {
//    React.render(<Handler />, document.getElementById('app-content'));
//});