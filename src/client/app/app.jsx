
import React from 'react';
import {render} from 'react-dom';
import { browserHistory, Router, Route, Link } from 'react-router'
import AuthService from './services/auth-service'
import Login from './views/pages/login-page.jsx'
import Dashboard from './views/pages/dashboard-page.jsx'
import Commissions from './views/pages/commissions-page.jsx'
import Salaries from './views/pages/salary-page/salaries-page.jsx'
import Agents from './views/pages/agents-and-partnerships-page.jsx'
import EditFiles from './views/pages/commission-files-page.jsx'
import AgentPage from './views/pages/agent-page.jsx'
import AgentSalaryPage from './views/pages/salary-page/agent-salary-page.jsx'
import PartnershipSalaryPage from './views/pages/salary-page/partnership-salary-page.jsx'
import PartnershipPage from './views/pages/partnership-page.jsx'
import TopBar from './views/top-bar.jsx';
import RightPanel from './views/right-panel.jsx';
import { strings } from './constants/strings'
import AppActions from './actions/app-actions'
import AppStore from './stores/data-store'
import AppModal from './views/common/app-modal.jsx';
import dispatcher from './dispatcher/app-dispatcher.js';
import {Modal} from './views/common/app-modal.jsx';
import {ActionType} from './actions/app-actions.js'
import LoadSpinner from 'react-loader'

dispatcher.registerStore(AppStore);
AppActions.appInit();

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
            showModal: false,
            modalContent: null,
            loginData: AuthService.getLoginData(),
            dataLoaded: false
        };
        this.appModalShowBinding = null
        this.appModalHideBinding = null
        this._renderData = this.renderData.bind(this)

    }
    componentWillUnmount()
    {
        this.appModalShowBinding.detach();
        this.appModalHideBinding.detach();
    }
    componentDidMount()
    {
        AppStore.addEventListener(ActionType.AGENTS_LOADED, this._renderData);

        //add signal listener
        this.appModalShowBinding = Modal.showWithContentSignal.add(this.showModal.bind(this));
        this.appModalHideBinding = Modal.hideSignal.add(this.hideModal.bind(this));
    }

    renderData()
    {
        this.state.dataLoaded = true
        this.setState(this.state)
    }

    onPanelItemClick(item)
    {
        if(strings.dashboard === item)
        {
            this.context.router.push('/app/dashboard')
        }
        if(strings.salaries === item)
        {
            this.context.router.push('/app/salaries')
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

    showModal(modalContent)
    {
        this.state.modalContent = modalContent
        this.state.showModal = true
        this.setState(this.state)
    }
    hideModal()
    {
        this.state.modalContent = null
        this.state.showModal = false
        this.setState(this.state)
    }
    render () {
        return (
            <div>
                { this.state.showModal ? <AppModal modalContent={this.state.modalContent} /> : null }
                <TopBar loginData={this.state.loginData}  onLogout={this.onLogout.bind(this)}/>
                <RightPanel onPanelItemClick={this.onPanelItemClick.bind(this)}/>
                <LoadSpinner loadedClassName="load-spinner" top={'50%'} left={'45%'} loaded={this.state.dataLoaded}>
                    {this.props.children}
                </LoadSpinner>
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
            <Route path="/app/salaries" component={Salaries} />
            <Route path="/app/commissions" component={Commissions} />
            <Route path="/app/commissions/edit-files" component={EditFiles} />
            <Route path="/app/agents-and-partnerships" component={Agents} />
            <Route path="/app/agents-and-partnerships/agent-salary-page/:index" component={AgentSalaryPage} />
            <Route path="/app/agents-and-partnerships/partnership-salary-page/:index" component={PartnershipSalaryPage} />
            <Route path="/app/agents-and-partnerships/agent-page/:index" component={AgentPage} />
            <Route path="/app/agents-and-partnerships/partnership-page/:index" component={PartnershipPage} />
        </Route>
   </Router>
), document.getElementById('content'))

