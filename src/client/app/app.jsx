import React from 'react';
import {render} from 'react-dom';
import { browserHistory, Router, Route, Link } from 'react-router'
//import AppDispatcher from './dispatcher/app-dispatcher';
//import AppContainerView from './views/app-container-view.jsx';
import AuthService from './services/auth-service'
import Login from './views/login-page.jsx'
import Signup from './views/signup-page.jsx'
import Dashboard from './views/dashboard-page.jsx'
import Commissions from './views/commissions-page.jsx'
import Agents from './views/agents-page.jsx'
import TopBar from './views/top-bar.jsx';
import RightPanel from './views/right-panel.jsx';
import { strings } from './constants/strings'

//import AppActions from './actions/app-actions';

//AppDispatcher.dispatch('APPINIT');

function isAuthenticated(nextState, replace)
{
    if (AuthService.loggedIn())
    {
        replace({
            pathname: '/app/dashboard',
            state: { nextPathname: nextState.location.pathname }
        })
    }
}

class App extends React.Component {

    constructor() {
        super()
        this.state = {
            loginData: AuthService.getLoginData()
        };
    }

    componentWillMount()
    {
    }

    onPanelItemClick(item)
    {
        console.log(item)
        if(strings.dashboard === item)
        {
            this.context.router.push('/app/dashboard')
        }
        if(strings.commissions === item)
        {
            this.context.router.push('/app/commissions')
        }
        if(strings.agents === item)
        {
            this.context.router.push('/app/agents')
        }
    }
    onLogout()
    {
        AuthService.logout()
        this.context.router.push('/')
    }
    render () {
        return (
            <div>
                <TopBar loginData={this.state.loginData}  onLogout={this.onLogout.bind(this)}/>
                <RightPanel onPanelItemClick={this.onPanelItemClick.bind(this)}/>
                {this.props.children}
            </div>
        );
    }
}

//Important!! This adds the router object to context
App.contextTypes = {
    router: React.PropTypes.object.isRequired
}


render((
    <Router history={browserHistory}>
        <Route path="/" component={Login} onEnter={isAuthenticated}/>
        <Route path="/app" component={App} >
            <Route path="/app/dashboard" component={Dashboard} />
            <Route path="/app/commissions" component={Commissions} />
            <Route path="/app/agents" component={Agents} />
        </Route>
   </Router>
), document.getElementById('content'))

//render((
//    <Router history={browserHistory}>
//        <Route path="/" component={App}>
//            <Route path="login" component={Login} />
//            <Route path="signup" component={Signup} />
//            <Route path="dashboard" component={Dashboard} /* onEnter={requireAuth}*/ />
//        </Route>
//    </Router>
//), document.getElementById('content'))

//AuthService.login()


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