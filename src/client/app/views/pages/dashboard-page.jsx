import React from 'react';
import AuthService from '../../services/auth-service'
import Button from 'muicss/lib/react/button'
import { strings } from '../../constants/strings'
import {Bar} from "react-chartjs";
import Table from './../common/table.jsx';
import MonthYearBox from './../common/month-year-box.jsx'
import {getMonthName,getMonthNumber,getMonths} from './../common/month-year-box.jsx'
import AppStore from '../../stores/data-store'
import {ActionType} from '../../actions/app-actions.js'
import DataService from '../../services/data-service.js';
import Dropdown from '../../../../../node_modules/muicss/lib/react/dropdown'
import DropdownItem from '../../../../../node_modules/muicss/lib/react/dropdown-item'


class DashboardToolbar extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            selectedMonth: props.month,
            selectedYear: props.year,
            commissionType: props.commissionType
        }
    }

    onMonthChange(month)
    {
        if(month != this.state.selectedMonth)
        {
            this.state.selectedMonth = month;
            this.setState(this.state);
            this.props.onMonthChange(month)
        }
    }
    onYearChange(year)
    {
        if(year != this.state.selectedYear)
        {
            this.state.selectedYear = year;
            this.setState(this.state);
            this.props.onYearChange(year)
        }
    }
    onLoadClick()
    {

    }
    onSelectCommissionTypeChange(item)
    {
        if(item.props.value != this.state.commissionType)
        {
            this.state.commissionType = item.props.value;
            this.setState(this.state);
            this.props.commissionTypeChange(item.props.value)
        }
    }
    render () {

        const commissions = [];
        var commissionTypes = AppStore.getCommissionTypes()
        for (let i = 0; i < commissionTypes.length; i++ )
        {
            commissions.push(<DropdownItem onClick={this.onSelectCommissionTypeChange.bind(this)} value={commissionTypes[i]} key={i}>{commissionTypes[i]}</DropdownItem>);
        }

        return (
            <div>
                <div className="hcontainer-no-wrap">
                    <MonthYearBox month={this.state.selectedMonth} year={this.state.selectedYear}
                              onMonthChange={this.onMonthChange.bind(this)}
                              onYearChange={this.onYearChange.bind(this)}/>
                        <div className="horizontal-spacer-10"/>
                        <div className="horizontal-spacer-10"/>
                        <div className="horizontal-spacer-10"/>
                    <Dropdown label={this.state.commissionType} alignMenu="right" color="primary" variant="raised">
                        {commissions}
                    </Dropdown>
                    </div>
                <div className="vertical-spacer-10"/>
            </div>

    );
    }
}

//<Button className="shadow" onClick={this.onLoadClick.bind(this)} color="primary">{strings.load}</Button>


class DashboardRankTable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            commissionType: props.commissionType
        }
    }
    componentWillReceiveProps(nextProps)
    {
        this.state.commissionType = nextProps.commissionType
        this.setState(this.state)
    }
    onCommissionTypeChange(type)
    {
        console.log(type)
    }
    render () {


        var columns = [

            {
                title: "שם סוכן",
                key: "agentName",
                width: "col-33-33",
                type: 'read-only',
                color: 'normal'
            },
            {
                title: this.state.commissionType,
                key: "commission",
                width: "col-33-33",
                type: 'read-only',
                format: 'currency',
                color: 'normal',
            },
            {
                title: "שינוי",
                key: "commissionChange",
                width: "col-33-33",
                type: 'read-only',
                format: 'percent',
                color: 'red-green'
            },
            {
                title: "גודל תיק",
                key: "totalInvestments",
                width: "col-33-33",
                type: 'read-only',
                format: 'currency',
                color: 'normal'
            },
            {
                title: "שינוי (גודל תיק)",
                key: "totalInvestmentsChange",
                width: "col-33-33",
                type: 'read-only',
                format: 'percent',
                color: 'red-green'
            }

        ]

        var data = [
                    {agentName: "קרין בוזלי", commission: "23234233", commissionChange: "2.3", totalInvestments: "23234233", totalInvestmentsChange: "2.3"},
                    {agentName: "עידן כץ", commission: "43234233", commissionChange: "2.3", totalInvestments: "23234233", totalInvestmentsChange: "2.3"},
                    {agentName: "מסי", commission: "33224233", commissionChange: "-2.3", totalInvestments: "23234233", totalInvestmentsChange: "6.3"},
                    {agentName: "מסי", commission: "33224233", commissionChange: "-2.3", totalInvestments: "23234233", totalInvestmentsChange: "6.3"},
                    {agentName: "מסי", commission: "33224233", commissionChange: "-2.3", totalInvestments: "23234233", totalInvestmentsChange: "6.3"},
                    {agentName: "מסי", commission: "33224233", commissionChange: "-2.3", totalInvestments: "23234233", totalInvestmentsChange: "6.3"},
                    {agentName: "קריזבז", commission: "13234233", commissionChange: "1.3", totalInvestments: "23234233", totalInvestmentsChange: "2.3"},
                    {agentName: "קרין בוזלי", commission: "23234233", commissionChange: "2.3", totalInvestments: "23234233", totalInvestmentsChange: "-2.3"},
                    {agentName: "קרין בוזלי", commission: "23234233", commissionChange: "2.3", totalInvestments: "23234233", totalInvestmentsChange: "2.3"},
                    ]

        return (
            <div className="dashboard-rank-table shadow">
                <Table columns={columns}
                       data={data}/>
            </div>
        );
    }
}

class DashboardCommissionChangeChart extends React.Component {

    constructor(props) {
        super(props);

    }

    render () {

        var data = {
            labels: getMonths(),
            datasets: [
                {
                    label: "My First dataset",
                    backgroundColor: "rgba(215,49,132,0.2)",
                    borderColor: "rgba(225,99,132,1)",
                    borderWidth: 1,
                    hoverBackgroundColor: "rgba(255,99,132,0.4)",
                    hoverBorderColor: "rgba(255,99,132,1)",
                    data: [165, 59, 80, 81, 256, 55, 40],
                    fillColor: "#4286b4"
                }
            ]
        };

        var chartOptions = {
            scaleFontFamily: "Tahoma",
            tooltipFontFamily: "Tahoma",
            scaleFontSize: 16,
            responsive: true,
            maintainAspectRatio: false
        }


        return (
            <div className="dashboard-commission-change-chart shadow">
                <div className="dashboard-box-title">{strings.totalInvestmentsChange}</div>
                <div className="dashboard-commission-change-chart-box">
                    <Bar data={data} options={chartOptions} width="600" height="400"/>
                </div>
            </div>
        );
    }
}

class DashboardMonthTotalCommissions extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            value: 0,
            change: 0
        }
    }

    render () {

        var value = this.state.value.toString();
        value = parseFloat(value.replace(/,/g, ""))
            .toFixed(0)
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

        var change = this.state.change
        var changeIcon = "../public/images/change-up.png"
        var changeColor = "green"
        if(change < 0)
        {
            changeIcon = "../public/images/change-down.png"
            changeColor = "red"
        }

        return (
            <div className="dashboard-month-total-commissions shadow">
                <div className="dashboard-box-title">{strings.totalCommissions}</div>
                <div className="dashboard-box-value green"><small>{"₪"}&nbsp;</small><b>{value}</b></div>
                <div className={"dashboard-box-change " + changeColor}>{change}<small>&nbsp;{"%"}</small>&nbsp;<img src={changeIcon}/></div>
            </div>
        );
    }
}

class DashboardMonthTotalAgents extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            value: "1",
            change: 0
        }
        this._reloadData = this.reloadData.bind(this)
    }
    componentDidMount()
    {
        AppStore.addEventListener(ActionType.AGENTS_LOADED, this._reloadData);
    }
    componentWillUnmount()
    {
        AppStore.removeEventListener(ActionType.AGENTS_LOADED,this._reloadData);
    }
    reloadData()
    {
        DataService.getActiveAgentCountForDate(this.props.date, (response) => {

            if(response.result == true)
            {
                this.state.value = response.data
                this.setState(this.state)
            }
        })
    }
    render () {

        var value = this.state.value.toString();
        //var change = this.state.change
        // var changeIcon = "../public/images/change-up.png"
        // var changeColor = "green"
        // if(change < 0)
        // {
        //     changeIcon = "../public/images/change-down.png"
        //     changeColor = "red"
        // }

        return (
            <div className="dashboard-month-total-agents shadow">
                <div className="dashboard-box-title">{strings.totalAgents}</div>
                <div className="dashboard-box-value green"><b>{value}</b></div>
                {/*<div className={"dashboard-box-change " + changeColor}>{change}<small>&nbsp;{"%"}</small>&nbsp;<img src={changeIcon}/></div>*/}
            </div>
        );
    }
}

class DashboardTotalInvestments extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            value: 0,
            change: 0
        }
    }

    render () {

        var value = this.state.value.toString();
        value = parseFloat(value.replace(/,/g, ""))
            .toFixed(0)
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

        var change = this.state.change
        var changeIcon = "../public/images/change-up.png"
        var changeColor = "green"
        if(change < 0)
        {
            changeIcon = "../public/images/change-down.png"
            changeColor = "red"
        }

        return (
            <div className="dashboard-total-investments shadow">
                <div className="dashboard-box-title">{strings.totalInvestments}</div>
                <div className="dashboard-box-value green"><small>{"₪"}&nbsp;</small><b>{value}</b></div>
                <div className={"dashboard-box-change " + changeColor}>{change}<small>&nbsp;{"%"}</small>&nbsp;<img src={changeIcon}/></div>
            </div>
        );
    }
}


class Dashboard extends React.Component {

    constructor(props) {
        super(props);

        var date = new Date()
        var currentMonth = getMonthName(date.getMonth().toString());
        var currentYear = date.getFullYear().toString();
        var monthStartDate = new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0);
        var commissionTypes = AppStore.getCommissionTypes()
        var selectedCommissionType = commissionTypes[0]

        this.state = {
            loginData: AuthService.getLoginData(),
            date: monthStartDate,
            selectedMonth: currentMonth,
            selectedYear:currentYear,
            selectedCommissionType:selectedCommissionType
        };

        this._reloadData = this.reloadData.bind(this)
    }
    componentDidMount()
    {
        AppStore.addEventListener(ActionType.AGENTS_LOADED, this._reloadData);
    }
    componentWillUnmount()
    {
        AppStore.removeEventListener(ActionType.AGENTS_LOADED,this._reloadData);
    }
    componentWillReceiveProps(nextProps)
    {

    }
    reloadData()
    {
        this.setState(this.state)
    }

    onMonthChange(month)
    {
        if(month != this.state.selectedMonth)
        {
            this.state.selectedMonth = month;
            this.state.date = new Date(this.state.date.getFullYear(), getMonthNumber(month), 1, 0, 0, 0, 0);
            this.setState(this.state);
        }
    }
    onYearChange(year)
    {
        if(year != this.state.selectedYear)
        {
            this.state.selectedYear = year;
            this.state.date = new Date(year, this.state.date.getMonth(), 1, 0, 0, 0, 0);
            this.setState(this.state);
        }
    }
    onCommissionTypeChange(type)
    {
        this.state.selectedCommissionType = type;
        this.setState(this.state);
    }
    render () {

        return (
            <div className="dashboard-page animated fadeIn">
                <DashboardToolbar month={this.state.selectedMonth}
                                  year={this.state.selectedYear}
                                  onMonthChange={this.onMonthChange.bind(this)}
                                  onYearChange={this.onYearChange.bind(this)}
                                  commissionType={this.state.selectedCommissionType}
                                  commissionTypeChange={this.onCommissionTypeChange.bind(this)} />
                <div className="hcontainer-no-wrap">
                    <DashboardRankTable  commissionType={this.state.selectedCommissionType}/>
                    <div className="horizontal-spacer-20"/>
                    <div className="dashboard-stats-container">
                        <div className="hcontainer-no-wrap dashboard-stats-container-top">
                            <DashboardMonthTotalCommissions />
                            <div className="horizontal-spacer-20"/>
                            <DashboardMonthTotalAgents date={this.state.date}/>
                        </div>
                        <div className="vertical-spacer-20"/>
                        <DashboardTotalInvestments />
                    </div>
                </div>
                <div className="vertical-spacer-20"/>
                <DashboardCommissionChangeChart />
            </div>
        );
    }
}

//Important!! This adds the router object to context
Dashboard.contextTypes = {
    router: React.PropTypes.object.isRequired
}




export default Dashboard;