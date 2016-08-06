import React from 'react';
import Table from './../common/table.jsx';
import AppStore from '../../stores/data-store'
import { strings } from '../../constants/strings'
import MonthYearBox from './../common/month-year-box.jsx'
import {getMonthName, getMonthNumber} from './../common/month-year-box.jsx'
import Button from 'muicss/lib/react/button'
import Divider from 'muicss/lib/react/divider';
import DataService from '../../services/data-service.js';

function currencyFormattedString(stringFloatValue)
{
    var value = stringFloatValue;
    value = parseFloat(value.replace(/,/g, ""))
        .toFixed(0)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return value
}



class AgentSalaryPage extends React.Component {

    constructor(props) {
        super(props);

        var date = new Date()
        var currentMonth = getMonthName(date.getMonth().toString());
        var currentYear = date.getFullYear().toString();
        var monthStartDate = new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0);

        this.state = {
            agent: AppStore.getAgentAtIndex(this.props.params.index),
            date: monthStartDate,
            selectedMonth: currentMonth,
            selectedYear:currentYear,
            incomes: {
                "היקף": [],
                "בונוס": [],
                "נפרעים": [],
                "ידני": []
            },
            manualIncomes: [],
            expenses: [],
            portfolio: "0"
    }
    }
    componentWillReceiveProps(nextProps)
    {
        // this.reloadData((value,change) => {
        //     this.state.value = value
        //     this.state.change = change
        //     this.setState(this.state)
        // })
    }
    componentDidMount()
    {
        this.reloadData((incomes, expenses, portfolio) => {

            this.state.incomes = incomes
            this.state.expenses = expenses
            this.state.portfolio = portfolio
            this.setState(this.state)
        })
    }
    componentWillUnmount()
    {

    }
    reloadData(callback)
    {
        var incomes,portfolio,expenses
        var idNumber = this.state.agent.idNumber
        var date = this.state.date

        DataService.loadAgentIncomesData(idNumber,date).then(function (value)
        {
            incomes = value
            DataService.loadAgentPortfolioData(idNumber, date).then(function (value)
            {
                portfolio = value
                DataService.loadAgentExpensesData(idNumber, date).then(function (value)
                {
                    expenses = value
                    callback(incomes,expenses,portfolio)
                }, function (reason) {
                    console.log("failed to load expenses data - " + reason)
                })
            }, function (reason) {
                console.log("failed to load portfolio data - " + reason)
            })
        }, function (reason) {
            console.log("failed to income data - " + reason)
        })
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
    onAgentNumberChange(year)
    {

    }
    onNewIncome()
    {

    }
    onNewExpense()
    {

    }

    render () {

        var incomesColumns = [

            {
                title: "חברה",
                key: "companyName",
                width: "col-33-33",
                type: 'read-only',
                color: 'normal'
            },
            {
                title: "מספר סוכן",
                key: "agentNumber",
                width: "col-33-33",
                type: 'input',
                color: 'normal',
                action: this.onAgentNumberChange.bind(this)
            },
            {
                title: "סוג תשלום",
                key: "agentNumber",
                width: "col-33-33",
                type: 'input',
                color: 'normal',
                action: this.onAgentNumberChange.bind(this)
            },
            {
                title: "הערות",
                key: "totalInvestments",
                width: "col-66-66",
                type: 'input',
                color: 'normal',
                action: this.onAgentNumberChange.bind(this)
            }
        ]

        var expensesColumns = [

            {
                title: "סוג הוצאה",
                key: "companyName",
                width: "col-33-33",
                type: 'read-only',
                color: 'normal'
            },
            {
                title: "סה״כ",
                key: "agentNumber",
                width: "col-33-33",
                type: 'input',
                color: 'normal',
                action: this.onAgentNumberChange.bind(this)
            },
            {
                title: "הערות",
                key: "agentName",
                width: "col-33-33",
                type: 'input',
                color: 'normal',
                action: this.onAgentNumberChange.bind(this)
            }
        ]

        var salary = currencyFormattedString("122211")
        var investments = currencyFormattedString("23123231")
        var nifraim = currencyFormattedString("23423")
        var bonus = currencyFormattedString("53454")
        var heikef = currencyFormattedString("45334")

        return (
            <div className="agent-salary-page animated fadeIn">

                <div className="hcontainer-no-wrap">
                    <MonthYearBox month={this.state.selectedMonth} year={this.state.selectedYear}
                                  onMonthChange={this.onMonthChange.bind(this)}
                                  onYearChange={this.onYearChange.bind(this)}/>
                </div>
                <div className="vertical-spacer-10"/>
                <div className="agent-salary-page-name-box shadow">{this.state.agent.name + ' ' + this.state.agent.familyName}</div>
                <div className="vertical-spacer-10"/>
                <div className="vertical-spacer-10"/>

                <div className="hcontainer-no-wrap">
                    <div className="agent-salary-page-total-salary-box shadow">
                        <div className="agent-salary-page-box-title">{strings.totalSalary}</div>
                        <div className="agent-salary-page-box-value green"><small>{"₪"}&nbsp;</small><b>{salary}</b></div>
                        <div className="hcontainer-no-wrap">
                            <div className="agent-salary-page-total-salary-sub-value-box">
                                <div className="agent-salary-page-total-salary-sub-value-box-title">{strings.nifraim}</div>
                                <div className="agent-salary-page-total-salary-sub-value-box-value green"><small>{"₪"}&nbsp;</small><b>{nifraim}</b></div>
                            </div>
                            <div className="agent-salary-page-total-salary-sub-value-box">
                                <div className="agent-salary-page-total-salary-sub-value-box-title">{strings.bonus}</div>
                                <div className="agent-salary-page-total-salary-sub-value-box-value green"><small>{"₪"}&nbsp;</small><b>{bonus}</b></div>
                            </div>
                            <div className="agent-salary-page-total-salary-sub-value-box">
                                <div className="agent-salary-page-total-salary-sub-value-box-title">{strings.heikef}</div>
                                <div className="agent-salary-page-total-salary-sub-value-box-value green"><small>{"₪"}&nbsp;</small><b>{heikef}</b></div>
                            </div>
                        </div>
                    </div>
                    <div className="horizontal-spacer-20"/>
                    <div className="agent-salary-page-total-investments-box shadow">
                        <div className="agent-salary-page-box-title">{strings.totalInvestments}</div>
                        <div className="agent-salary-page-box-value green"><small>{"₪"}&nbsp;</small><b>{investments}</b></div>
                    </div>
                </div>

                <div className="agent-salary-page-table-box shadow">
                    <div className="agent-salary-page-table-box-top">
                        <div className="agent-salary-page-table-title">{strings.incomes}</div>
                        <Button className="shadow" onClick={this.onNewIncome.bind(this)} color="primary">{strings.newIncome}</Button>
                    </div>
                    <div className="agent-salary-page-income-table">
                        <Table columns={incomesColumns}
                               data={null}/>
                    </div>
                    <Divider className="agent-salary-page-divider"/>

                    <div className="agent-salary-page-income-table">
                        <Table hideHeader={true} columns={incomesColumns}
                               data={null} noHeader/>
                    </div>

                </div>

                <div className="agent-salary-page-table-box shadow">
                    <div className="agent-salary-page-table-box-top">
                        <div className="agent-salary-page-table-title">{strings.expenses}</div>
                        <Button className="shadow" onClick={this.onNewExpense.bind(this)} color="primary">{strings.newExpense}</Button>
                    </div>
                    <div className="agent-salary-page-expense-table">
                        <Table columns={expensesColumns}
                               data={null}/>
                    </div>
                </div>

            </div>
        );
    }
}

//Important!! This adds the router object to context
AgentSalaryPage.contextTypes = {
    router: React.PropTypes.object.isRequired
}

export default AgentSalaryPage;