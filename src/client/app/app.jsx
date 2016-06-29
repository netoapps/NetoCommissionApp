import React from 'react';
import {render} from 'react-dom';
import { browserHistory, Router, Route, Link } from 'react-router'
import AuthService from './services/auth-service'
import Login from './views/pages/login-page.jsx'
import Signup from './views/pages/signup-page.jsx'
import Dashboard from './views/pages/dashboard-page.jsx'
import Commissions from './views/pages/commissions-page.jsx'
import Agents from './views/pages/agents-and-partnerships-page.jsx'
import EditFiles from './views/pages/commission-files-page.jsx'
import AgentPage from './views/pages/agent-page.jsx'
import AgentSalaryPage from './views/pages/agent-salary-page.jsx'
import PartnershipPage from './views/pages/partnership-page.jsx'
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

            <Route path="/app/agents-and-partnerships/agent-salary-page/:index" component={AgentSalaryPage} />
            <Route path="/app/agents-and-partnerships/agent-page/:index" component={AgentPage} />
            <Route path="/app/agents-and-partnerships/partnership-page/:index" component={PartnershipPage} />
        </Route>
   </Router>
), document.getElementById('content'))

