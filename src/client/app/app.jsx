import React from 'react';
import {render} from 'react-dom';
import { browserHistory, Router, Route, Link } from 'react-router'
import AuthService from './services/auth-service'
import Login from './views/login-page.jsx'
import Signup from './views/signup-page.jsx'
import Dashboard from './views/dashboard-page.jsx'
import Commissions from './views/commissions-page.jsx'
import Agents from './views/agents-and-partnerships-page.jsx'
import EditFiles from './views/edit-files-page.jsx'
import NewAgentPage from './views/new-agent-page.jsx'
import TopBar from './views/top-bar.jsx';
import RightPanel from './views/right-panel.jsx';
import { strings } from './constants/strings'

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
        if(strings.dashboard === item)
        {
            this.context.router.push('/app/dashboard')
        }
        if(strings.commissions === item)
        {
            this.context.router.push('/app/commissions')
        }
        if(strings.agentsAndPartnerships === item)
        {
            this.context.router.push('/app/agents-and-partnerships')
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
            <Route path="/app/commissions/edit-files" component={EditFiles} />
            <Route path="/app/agents-and-partnerships" component={Agents} />
            <Route path="/app/agents-and-partnerships/new-agent-page" component={NewAgentPage} />
        </Route>
   </Router>
), document.getElementById('content'))

