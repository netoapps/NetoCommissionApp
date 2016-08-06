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

class NewIncomeModal extends React.Component{
    constructor(props) {
        super(props);

        var companies = AppStore.getCompanies().concat(["שונות"])
        var commissionTypes = AppStore.getCommissionTypes().concat(["שונות"])

        this.state = {
            companies:companies,
            commissionTypes:commissionTypes,
            income: [{
                    company: companies[0],
                    agentInCompanyId: "",
                    type: commissionTypes[0],
                    repeat: 1,
                    notes:""
                    }]
        }
    }
    onIncomeCompanyChange(index,value)
    {
        // this.state.agent.paymentsDetails[index].companyName = value
        this.setState(this.state)
    }
    onIncomeCommissionTypeChange(index,value)
    {
        // this.state.agent.paymentsDetails[index].paymentType = value
        this.setState(this.state)
    }
    onIncomeAgentNumberChange(index,value)
    {
        // this.state.agent.paymentsDetails[index].agentNumber = value
        this.setState(this.state)
    }
    onIncomeNoteChange()
    {

    }
    onIncomeRepeatChange()
    {

    }

    onCancel()
    {

    }
    onSave()
    {

    }
    render(){
        const { text,onRequestClose } = this.props;

        var columns = [

            {
                title: "חברה",
                key: "company",
                width: "col-33-33",
                type: 'select',
                color: 'normal',
                action: this.onIncomeCompanyChange.bind(this),
                options: this.state.companies
            },
            {
                title: "מספר סוכן",
                key: "agentInCompanyId",
                width: "col-33-33",
                type: 'input',
                color: 'normal',
                action: this.onIncomeAgentNumberChange.bind(this)
            },
            {
                title: "סוג תשלום",
                key: "type",
                width: "col-33-33",
                type: 'select',
                color: 'normal',
                action: this.onIncomeCommissionTypeChange.bind(this),
                options: this.state.commissionTypes
            },
            {
                title: "מחזוריות",
                key: "repeat",
                width: "col-33-33",
                type: 'input',
                color: 'normal',
                action: this.onIncomeRepeatChange.bind(this)
            },
            {
                title: "הערות",
                key: "notes",
                width: "col-66-66",
                type: 'input',
                color: 'normal',
                action: this.onIncomeNoteChange.bind(this)
            }
        ]

        return (
            <div className="remodal-bg">
                <div className="remodal" data-remodal-id="modal">
                    <button data-remodal-action="close" className="remodal-close"></button>
                    <div className="modal-title">{strings.newIncome}</div>
                    <div className="modal-table">
                        <Table columns={columns}
                               data={this.state.income}/>
                    </div>
                    <div className="hcontainer-no-wrap">
                        <div className="horizontal-spacer-90"/>
                        <Button data-remodal-action="cancel" className="shadow" onClick={this.onCancel.bind(this)} color="default">{strings.cancel}</Button>
                        <div className="horizontal-spacer-20"/>
                        <Button data-remodal-action="confirm" className="shadow" onClick={this.onSave.bind(this)} color="primary">{strings.save}</Button>
                    </div>
                </div>
            </div>
        );
    }
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
            this.reloadData((incomes, expenses, portfolio) => {

                this.state.incomes = incomes
                this.state.expenses = expenses
                this.state.portfolio = portfolio
                this.setState(this.state)
            })
        }
    }
    onYearChange(year)
    {
        if(year != this.state.selectedYear)
        {
            this.state.selectedYear = year;
            this.state.date = new Date(year, this.state.date.getMonth(), 1, 0, 0, 0, 0);
            this.reloadData((incomes, expenses, portfolio) => {

                this.state.incomes = incomes
                this.state.expenses = expenses
                this.state.portfolio = portfolio
                this.setState(this.state)
            })
        }
    }
    //Manual income
    onNewIncome()
    {
        // ModalManager.open(<NewIncomeModal text={"בדיקה"} onRequestClose={() => true}/>);

        var inst = $('[data-remodal-id=modal]').remodal();

        /**
         * Opens the modal window
         */
        inst.open();
    }

    onIncomeCompanyChange(index,value)
    {
       // this.state.agent.paymentsDetails[index].companyName = value
        this.setState(this.state)
    }
    onIncomeCommissionTypeChange(index,value)
    {
       // this.state.agent.paymentsDetails[index].paymentType = value
        this.setState(this.state)
    }
    onIncomeAgentNumberChange(index,value)
    {
       // this.state.agent.paymentsDetails[index].agentNumber = value
        this.setState(this.state)
    }
    onIncomeNoteChange()
    {

    }
    handleNewIncomeSave()
    {

    }
    //Expense
    onExpenseNoteChange()
    {

    }
    onExpenseAgentNumberChange()
    {

    }
    onNewExpense()
    {

    }

    sumOfIncomeWithType(type)
    {
        var sum = 0
        if(this.state.incomes[type].length > 0)
        {
            for(var index = 0; index < this.state.incomes[type].length; index++)
            {
                sum += this.state.incomes[type][index].amount
            }
        }
        return sum
    }

    render () {

        var incomesColumns = [

            {
                title: "חברה",
                key: "company",
                width: "col-33-33",
                type: 'read-only',
                color: 'normal'
            },
            {
                title: "מספר סוכן",
                key: "agentInCompanyId",
                width: "col-33-33",
                type: 'read-only',
                color: 'normal'
            },
            {
                title: "סוג תשלום",
                key: "type",
                width: "col-33-33",
                type: 'read-only',
                color: 'normal'
            },
            {
                title: "הערות",
                key: "notes",
                width: "col-66-66",
                type: 'read-only',
                color: 'normal',
            }
        ]

        var companies = AppStore.getCompanies().concat(["שונות"])
        var commissionTypes = AppStore.getCommissionTypes().concat(["שונות"])

        var manualIncomesColumns = [

            {
                title: "חברה",
                key: "company",
                width: "col-33-33",
                type: 'select',
                color: 'normal',
                action: this.onIncomeCompanyChange.bind(this),
                options: companies
            },
            {
                title: "מספר סוכן",
                key: "agentInCompanyId",
                width: "col-33-33",
                type: 'input',
                color: 'normal',
                action: this.onIncomeAgentNumberChange.bind(this)
            },
            {
                title: "סוג תשלום",
                key: "type",
                width: "col-33-33",
                type: 'select',
                color: 'normal',
                action: this.onIncomeCommissionTypeChange.bind(this),
                options: commissionTypes
            },
            {
                title: "הערות",
                key: "notes",
                width: "col-66-66",
                type: 'input',
                color: 'normal',
                action: this.onIncomeNoteChange.bind(this)
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
                action: this.onExpenseAgentNumberChange.bind(this)
            },
            {
                title: "הערות",
                key: "agentName",
                width: "col-33-33",
                type: 'input',
                color: 'normal',
                action: this.onExpenseNoteChange.bind(this)
            }
        ]

        var nifraim = this.sumOfIncomeWithType("נפרעים")
        var bonus = this.sumOfIncomeWithType("בונוס")
        var heikef = this.sumOfIncomeWithType("היקף")
        var manual = this.sumOfIncomeWithType("ידני")
        var expenses = 0
        var salary = nifraim + bonus + heikef + manual - expenses

        var incomesData = this.state.incomes["היקף"].concat(this.state.incomes["נפרעים"]).concat(this.state.incomes["בונוס"])
        var manualIncomesData = this.state.incomes["ידני"]

        return (
            <div className="agent-salary-page animated fadeIn">

                <NewIncomeModal />

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
                        <div className="agent-salary-page-box-value green"><small>{"₪"}&nbsp;</small><b>{currencyFormattedString(salary.toString())}</b></div>
                        <div className="hcontainer-no-wrap">
                            <div className="agent-salary-page-total-salary-sub-value-box">
                                <div className="agent-salary-page-total-salary-sub-value-box-title">{strings.nifraim}</div>
                                <div className="agent-salary-page-total-salary-sub-value-box-value green"><small>{"₪"}&nbsp;</small><b>{currencyFormattedString(nifraim.toString())}</b></div>
                            </div>
                            <div className="agent-salary-page-total-salary-sub-value-box">
                                <div className="agent-salary-page-total-salary-sub-value-box-title">{strings.bonus}</div>
                                <div className="agent-salary-page-total-salary-sub-value-box-value green"><small>{"₪"}&nbsp;</small><b>{currencyFormattedString(bonus.toString())}</b></div>
                            </div>
                            <div className="agent-salary-page-total-salary-sub-value-box">
                                <div className="agent-salary-page-total-salary-sub-value-box-title">{strings.heikef}</div>
                                <div className="agent-salary-page-total-salary-sub-value-box-value green"><small>{"₪"}&nbsp;</small><b>{currencyFormattedString(heikef.toString())}</b></div>
                            </div>
                            <div className="agent-salary-page-total-salary-sub-value-box">
                                <div className="agent-salary-page-total-salary-sub-value-box-title">{strings.manualIncome}</div>
                                <div className="agent-salary-page-total-salary-sub-value-box-value green"><small>{"₪"}&nbsp;</small><b>{currencyFormattedString(manual.toString())}</b></div>
                            </div>
                        </div>
                    </div>
                    <div className="horizontal-spacer-20"/>
                    <div className="agent-salary-page-total-investments-box shadow">
                        <div className="agent-salary-page-box-title">{strings.totalPortfolio}</div>
                        <div className="agent-salary-page-box-value green"><small>{"₪"}&nbsp;</small><b>{currencyFormattedString(this.state.portfolio.toString())}</b></div>
                    </div>
                </div>

                <div className="agent-salary-page-table-box shadow">
                    <div className="agent-salary-page-table-box-top">
                        <div className="agent-salary-page-table-title">{strings.incomes}</div>
                        <Button className="shadow" onClick={this.onNewIncome.bind(this)} color="primary">{strings.newIncome}</Button>
                    </div>
                    <div className="agent-salary-page-income-table">
                        <Table columns={incomesColumns}
                               data={incomesData}/>
                    </div>
                    <Divider className="agent-salary-page-divider"/>

                    <div className="agent-salary-page-income-table">
                        <Table hideHeader={true} columns={manualIncomesColumns}
                               data={manualIncomesData} noHeader/>
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