import React from 'react';
import AuthService from '../../services/auth-service'
import Button from '../../../../../node_modules/muicss/lib/react/button'
import Dropdown from '../../../../../node_modules/muicss/lib/react/dropdown';
import DropdownItem from '../../../../../node_modules/muicss/lib/react/dropdown-item';
import FixedWidthDropdown from './../common/FixedWidthDropdown.jsx';
import { strings } from '../../constants/strings'
import Chart from "react-chartjs";
import {Bar} from "react-chartjs";
import Table from './../common/table.jsx';



var monthOptions = ["ינואר","פברואר","מרץ","אפריל","מאי","יוני","יולי","אוגוסט","ספטמבר","אוקטובר","נובמבר","דצמבר"];

function getMonthName(monthNum)
{

    if(monthNum > 12 || monthNum < 1)
    {
        return monthOptions[0];
    }
    return monthOptions[monthNum - 1];
}

class DashboardToolbar extends React.Component {

    constructor(props) {
        super(props);

        var date = new Date();
        var currentMonth = date.getMonth();
        var currentYear = date.getFullYear();

        this.state = {
            selectedMonth: getMonthName(currentMonth),
            selectedYear: currentYear.toString()
        }
    }

    onMonthChange(item)
    {
        if(item.props.value != this.state.selectedMonth)
        {
            this.setState({selectedMonth: item.props.value});
        }
    }
    onYearChange(item)
    {
        if(item.props.value != this.state.selectedYear)
        {
            this.setState({selectedYear: item.props.value});
        }
    }
    onLoadClick()
    {

    }

    render () {

        const months = [];
        for (let i = 1; i <= 12; i++ ) {
            var monthName = getMonthName(i)
            months.push(<DropdownItem onClick={this.onMonthChange.bind(this)} value={monthName} key={i}>{monthName}</DropdownItem>);
        }

        const years = [];
        var date = new Date();
        var currentYear = date.getFullYear()
        for (let i = 2012; i <= currentYear; i++ ) {
            var yearName = i.toString()
            years.push(<DropdownItem onClick={this.onYearChange.bind(this)} value={yearName} key={i}>{yearName}</DropdownItem>);
        }

        return (
            <div className="hcontainer-no-wrap">
                <FixedWidthDropdown label={this.state.selectedMonth} alignMenu="right" >
                        {months}
                </FixedWidthDropdown>
                <div className="dashboard-buttons-horizontal-spacer"/>
                <FixedWidthDropdown className="fixed-size-button" label={this.state.selectedYear} alignMenu="right" >
                    {years}
                </FixedWidthDropdown>
                <div className="dashboard-buttons-horizontal-spacer"/>
                <div className="dashboard-buttons-horizontal-spacer"/>
                <div className="dashboard-buttons-horizontal-spacer"/>
                <Button className="shadow" onClick={this.onLoadClick.bind(this)} color="primary">{strings.load}</Button>
            </div>
        );
    }
}



class DashboardRankTable extends React.Component {

    constructor(props) {
        super(props);

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
                title: "עמלות",
                key: "commission",
                width: "col-33-33",
                type: 'read-only-currency',
                color: 'normal'
            },
            {
                title: "שינוי (עמלות)",
                key: "commissionChange",
                width: "col-33-33",
                type: 'read-only-percent',
                color: 'red-green'
            },
            {
                title: "גודל תיק",
                key: "totalInvestments",
                width: "col-33-33",
                type: 'read-only-currency',
                color: 'normal'
            },
            {
                title: "שינוי (גודל תיק)",
                key: "totalInvestmentsChange",
                width: "col-33-33",
                type: 'read-only-percent',
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
            labels: monthOptions,
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
            value: 233423432,
            change: 3.2
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
                <div className="dashboard-box-value blue"><small>{"₪"}&nbsp;</small><b>{value}</b></div>
                <div className={"dashboard-box-change " + changeColor}>{change}<small>&nbsp;{"%"}</small>&nbsp;<img src={changeIcon}/></div>
            </div>
        );
    }
}

class DashboardMonthTotalAgents extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            value: 999,
            change: 3.4
        }
    }

    render () {

        var value = this.state.value.toString();

        var change = this.state.change
        var changeIcon = "../public/images/change-up.png"
        var changeColor = "green"
        if(change < 0)
        {
            changeIcon = "../public/images/change-down.png"
            changeColor = "red"
        }


        return (
            <div className="dashboard-month-total-agents shadow">
                <div className="dashboard-box-title">{strings.totalAgents}</div>
                <div className="dashboard-box-value blue"><b>{value}</b></div>
                <div className={"dashboard-box-change " + changeColor}>{change}<small>&nbsp;{"%"}</small>&nbsp;<img src={changeIcon}/></div>
            </div>
        );
    }
}

class DashboardTotalInvestments extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            value: 433423432,
            change: -1.2
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
                <div className="dashboard-box-value blue"><small>{"₪"}&nbsp;</small><b>{value}</b></div>
                <div className={"dashboard-box-change " + changeColor}>{change}<small>&nbsp;{"%"}</small>&nbsp;<img src={changeIcon}/></div>
            </div>
        );
    }
}


class Dashboard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loginData: AuthService.getLoginData()
        };
    }
    render () {
        return (
            <div className="dashboard-page animated fadeIn">
                <DashboardToolbar />
                <div className="hcontainer-no-wrap">
                    <DashboardRankTable  />
                    <div className="dashboard-horizontal-spacer"/>
                    <div className="dashboard-stats-container">
                        <div className="hcontainer-no-wrap dashboard-stats-container-top">
                            <DashboardMonthTotalCommissions />
                            <div className="dashboard-horizontal-spacer"/>
                            <DashboardMonthTotalAgents />
                        </div>
                        <div className="dashboard-vertical-spacer"/>
                        <DashboardTotalInvestments />
                    </div>
                </div>
                <div className="dashboard-vertical-spacer"/>
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