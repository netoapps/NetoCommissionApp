import React from 'react';
import AuthService from '../../services/auth-service'
import { strings } from '../../constants/strings'
import {Bar} from "react-chartjs";
import Table from './../common/table.jsx';
import MonthYearBox from './../common/month-year-box.jsx'
import {getMonthName,getMonthNumber,getMonths} from './../common/month-year-box.jsx'
import AppStore from '../../stores/data-store'
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
    // onLoadClick()
    // {
    //
    // }
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
            commissionType: props.commissionType,
            date: props.date,
            data: []
        }
    }
    componentDidMount()
    {
        this.reloadData((data) => {
            this.state.data = data
            this.setState(this.state)
        })
    }
    componentWillReceiveProps(nextProps)
    {
        this.state.commissionType = nextProps.commissionType
        this.state.date = nextProps.date
        this.reloadData((data) => {
            this.state.data = data
            this.setState(this.state)
        })
    }
    reloadData(callback)
    {
        DataService.loadCommissionFilesEntriesByIdWithTypeAndDate(this.state.commissionType,this.state.date, (response) => {
            var data = []
            if(response.result == true)
            {
                var idsData = Object.keys(response.data)
                for (const item of idsData)
                {
                    var idData = response.data[item]
                    var agent = AppStore.getAgent(item)
                    var agentName = ""
                    if (agent != null) {
                        agentName = agent.name + " " + agent.familyName
                    }
                    agentName = agent.name + " " + agent.familyName

                    var portfolio = idData.currentMonth.portfolio
                    var portfolioChange = 0
                    var amount = idData.currentMonth.amount
                    var amountChange = 0

                    if(idData.currentMonth.portfolio > idData.previousMonth.portfolio)
                    {
                        portfolioChange = 100
                        if(idData.previousMonth.portfolio != 0)
                        {
                            portfolioChange = idData.currentMonth.portfolio / idData.previousMonth.portfolio
                        }
                    }
                    if(idData.currentMonth.portfolio < idData.previousMonth.portfolio) {
                        portfolioChange = -100
                        if (idData.currentMonth.portfolio != 0)
                        {
                            portfolioChange = -1*(idData.previousMonth.portfolio / idData.currentMonth.portfolio)
                        }
                    }

                    if(idData.currentMonth.amount > idData.previousMonth.amount)
                    {
                        amountChange = 100
                        if(idData.previousMonth.amount != 0)
                        {
                            amountChange = idData.currentMonth.amount / idData.previousMonth.amount
                        }
                    }
                    if(idData.currentMonth.amount < idData.previousMonth.amount) {
                        amountChange = -100
                        if (idData.currentMonth.amount != 0)
                        {
                            amountChange = -1*(idData.previousMonth.amount / idData.currentMonth.amount)
                        }
                    }

                    // var amount = idData[0].amount
                    // var lastMonthAmount = idData.length > 1 ? idData[1].amount:0
                    // var amountChange = 100.0
                    // if (lastMonthAmount != 0)
                    // {
                    //     amountChange = (parseFloat(amount)/parseFloat(lastMonthAmount)) * 100.0
                    // }
                    //
                    // var portfolio = idData[0].portfolio
                    // var lastMonthPortfolio = idData.length > 1 ? idData[1].portfolio:0
                    // var portfolioChange = 100.0
                    // if (lastMonthPortfolio != 0)
                    // {
                    //     portfolioChange = (parseFloat(portfolio)/parseFloat(lastMonthPortfolio)) * 100.0
                    // }

                    data.push(
                        {
                        agentName: agentName,
                        commission: amount,
                        commissionChange: amountChange,
                        portfolio: portfolio,
                        portfolioChange: portfolioChange
                    })
                }
            }
            else
            {
                this.logger.error("Error while loading commission files entries");
            }
            callback(data)
        })
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
                key: "portfolio",
                width: "col-33-33",
                type: 'read-only',
                format: 'currency',
                color: 'normal'
            },
            {
                title: "שינוי (גודל תיק)",
                key: "portfolioChange",
                width: "col-33-33",
                type: 'read-only',
                format: 'percent',
                color: 'red-green'
            }

        ]

        return (
            <div className="dashboard-rank-table shadow">
                <Table columns={columns}
                       data={this.state.data}/>
            </div>
        );
    }
}

class DashboardCommissionChangeChart extends React.Component {

    constructor(props)
    {
        super(props);
        this.state = {
            commissionType: props.commissionType,
            year: props.year,
            data: [0,0,0,0,0,0,0,0,0,0,0,0]
        }
    }
    componentWillReceiveProps(nextProps)
    {
        this.state.commissionType = nextProps.commissionType
        this.state.year = nextProps.year
        this.reloadData((data) => {
            this.state.data = data
            this.setState(this.state)
        })
    }
    componentDidMount()
    {
        this.reloadData((data) => {
             this.state.data = data
            this.setState(this.state)
        })
    }

    reloadData(callback)
    {
        DataService.loadCommissionFilesEntriesWithTypeAndYear(this.state.commissionType,this.state.year, (response) => {
            var data = [0,0,0,0,0,0,0,0,0,0,0,0]
            if(response.result == true)
            {
                for (const item of response.data)
                {
                    data[item._id] = item.amount
                }
            }
            else
            {
                this.logger.error("Error while loading commission files entries");
            }
            callback(data)
        })
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
                    data: this.state.data,
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
                <div className="dashboard-box-title">{"סה״כ " + this.state.commissionType}</div>
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
            commissionType: props.commissionType,
            date: props.date,
            value: "0",
            change: "0"
        }
    }
    componentWillReceiveProps(nextProps)
    {
        this.state.commissionType = nextProps.commissionType
        this.state.date = nextProps.date
        this.reloadData((value,change) => {
            this.state.value = value
            this.state.change = change
            this.setState(this.state)
        })
    }
    componentDidMount()
    {
        this.reloadData((value,change) => {
            this.state.value = value
            this.state.change = change
            this.setState(this.state)
        })
    }
    componentWillUnmount()
    {

    }
    reloadData(callback)
    {
        DataService.loadTotalCommissionAndPortfolioForTypeAndDate(this.state.commissionType,this.state.date, (response) => {

            var value = response.data.currentMonth.amount
            var change = 0
            if(response.data.currentMonth.amount > response.data.previousMonth.amount)
            {
                change = 100
                if(response.data.previousMonth.amount != 0)
                {
                    change = response.data.currentMonth.amount / response.data.previousMonth.amount
                }
            }
            if(response.data.currentMonth.amount < response.data.previousMonth.amount) {
                change = -100
                if (response.data.currentMonth.amount != 0)
                {
                    change = -1*(response.data.previousMonth.amount / response.data.currentMonth.amount)
                }
            }
            callback(value,change)
        })
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
                <div className="dashboard-box-title">{strings.totalValue + this.state.commissionType}</div>
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
            date: props.date,
            value: "0",
            change: 0
        }
    }
    componentWillReceiveProps(nextProps)
    {
        this.state.date = nextProps.date
        this.reloadData((data) => {
            this.state.value = data
            this.state.change = "0"
            this.setState(this.state)
        })
    }
    componentDidMount()
    {
        this.reloadData((data) => {
            this.state.value = data
            this.state.change = "0"
            this.setState(this.state)
        })
    }
    componentWillUnmount()
    {

    }
    reloadData(callback)
    {
        DataService.getActiveAgentCountForDate(this.state.date, (response) => {

            var data = "0"
            if(response.result == true)
            {
                data = response.data
            }
            else
            {

            }
            callback(data)
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

class DashboardTotalPortfolio extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            commissionType: props.commissionType,
            date: props.date,
            value: 0,
            change: "0"
        }
    }
    componentWillReceiveProps(nextProps)
    {
        this.state.commissionType = nextProps.commissionType
        this.state.date = nextProps.date
        this.reloadData((value,change) => {
            this.state.value = value
            this.state.change = change
            this.setState(this.state)
        })
    }
    componentDidMount()
    {
        this.reloadData((value,change) => {
            this.state.value = value
            this.state.change = change
            this.setState(this.state)
        })
    }
    componentWillUnmount()
    {

    }
    reloadData(callback)
    {
        DataService.loadTotalCommissionAndPortfolioForTypeAndDate(this.state.commissionType,this.state.date, (response) => {

            var value = response.data.currentMonth.portfolio
            var change = 0

            if(response.data.currentMonth.portfolio > response.data.previousMonth.portfolio)
            {
                change = 100
                if(response.data.previousMonth.portfolio != 0)
                {
                    change = response.data.currentMonth.portfolio / response.data.previousMonth.portfolio
                }
            }
            if(response.data.currentMonth.portfolio < response.data.previousMonth.portfolio) {
                change = -100
                if (response.data.currentMonth.portfolio != 0)
                {
                    change = -1*(response.data.previousMonth.portfolio / response.data.currentMonth.portfolio)
                }
            }
            callback(value,change)
        })
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
    }
    componentDidMount()
    {
    }
    componentWillUnmount()
    {
    }
    componentWillReceiveProps(nextProps)
    {

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
                    <DashboardRankTable  commissionType={this.state.selectedCommissionType}
                                         date={this.state.date}/>
                    <div className="horizontal-spacer-20"/>
                    <div className="dashboard-stats-container">
                        {/*<div className="hcontainer-no-wrap dashboard-stats-container-top">*/}
                            {/*<DashboardMonthTotalCommissions*/}
                                {/*commissionType={this.state.selectedCommissionType}*/}
                                {/*date={this.state.date}*/}
                            {/*/>*/}
                            {/*<div className="horizontal-spacer-20"/>*/}
                            {/*<DashboardMonthTotalAgents date={this.state.date}/>*/}
                        {/*</div>*/}
                        {/*<div className="vertical-spacer-20"/>*/}
                        {/*<DashboardTotalPortfolio*/}
                            {/*commissionType={this.state.selectedCommissionType}*/}
                            {/*date={this.state.date}*/}
                        {/*/>*/}
                    {/*</div>*/}

                        <div className="hcontainer-no-wrap dashboard-stats-container-top">
                            <DashboardMonthTotalCommissions
                                commissionType={this.state.selectedCommissionType}
                                date={this.state.date}/>
                            <div className="horizontal-spacer-20"/>
                            <DashboardTotalPortfolio
                                commissionType={this.state.selectedCommissionType}
                                date={this.state.date}/>
                        </div>
                        <div className="vertical-spacer-20"/>
                        <DashboardMonthTotalAgents date={this.state.date}/>
                    </div>


                </div>
                <div className="vertical-spacer-20"/>
                <DashboardCommissionChangeChart
                    commissionType={this.state.selectedCommissionType}
                    year={this.state.date.getFullYear()} />
            </div>
        );
    }
}

//Important!! This adds the router object to context
Dashboard.contextTypes = {
    router: React.PropTypes.object.isRequired
}




export default Dashboard;