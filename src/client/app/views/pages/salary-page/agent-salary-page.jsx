import React from 'react';
import Table from '../../common/table.jsx';
import AppStore from '../../../stores/data-store'
import { strings } from '../../../constants/strings'
import MonthYearBox from '../../common/month-year-box.jsx'
import {getMonthName, getMonthNumber} from '../../common/month-year-box.jsx'
import Button from 'muicss/lib/react/button'
import DataService from '../../../services/data-service.js';
import {Modal} from '../../common/app-modal.jsx';
import Income from '../../../model/income.js';
import Expense from '../../../model/expense.js';
import IncomeModalContent  from './income-modal-content.jsx';
import ExpenseModalContent  from './expense-modal-content.jsx';

function currencyFormattedString(stringFloatValue)
{
    var value = stringFloatValue;
    value = parseFloat(value.replace(/,/g, ""))
        .toFixed(0)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return value
}

var companies = AppStore.getCompanies()
var commissionTypes = AppStore.getCommissionTypes().concat(AppStore.getExtendedCommissionTypes())

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
            incomes: [],
            expenses: [],
            portfolio: "0",
            newIncomeVisible: false,
            selectedIncome: null,
            selectedExpense: null,
        }
    }

    componentDidMount()
    {
        this.reloadData((incomes, expenses, portfolio) => {

            this.state.incomes = this.concatAllIncomes(incomes)
            this.state.expenses = expenses
            this.state.portfolio = portfolio
            this.setState(this.state)
        })
    }
    componentWillUnmount()
    {

    }
    setIncomes(incomes)
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

                this.state.incomes = this.concatAllIncomes(incomes)
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

                this.state.incomes = this.concatAllIncomes(incomes)
                this.state.expenses = expenses
                this.state.portfolio = portfolio
                this.setState(this.state)
            })
        }
    }
    //Manual income
    openIncomeModal(income, index)
    {
        var incomeModalContent =  <IncomeModalContent companies={companies}
                                                      commissionTypes={commissionTypes}
                                                      income={income}
                                                      incomeIndex={index}
                                                      onSaveIncome={this.onSaveIncome.bind(this)}/>

        Modal.showWithContent(incomeModalContent)
    }
    onNewIncome()
    {
        var income = new Income()
        income.company = companies[0]
        income.type = commissionTypes[0]
        this.openIncomeModal(income,-1)
    }

    onIncomeRowClick(index,income)
    {
        //Save income before editing so we can refer to type even if it was edited
        this.state.selectedIncome = income
        this.openIncomeModal(new Income(income),index)
    }

    updateIncome(incomeId, updatedIncome)
    {
        for(var index = 0; index < this.state.incomes.length; index++)
        {
            if(this.state.incomes[index]._id === incomeId)
            {
                this.state.incomes[index] = updatedIncome
                return true
            }
        }
        return false
    }

    onSaveIncome(income,index)
    {
        if(index != -1)
        {
            DataService.updateAgentSalaryIncome(this.state.selectedIncome._id,income,this.state.agent.idNumber, (response) => {

                if(response.result == true)
                {
                    if(this.updateIncome(this.state.selectedIncome._id,response.data))
                    {
                        console.log("Income with id " + this.state.selectedIncome._id + " updated successfully")
                        this.state.selectedIncome = null
                        this.setState(this.state)
                    }
                    else
                    {
                        console.log("ERROR while updating income with id " + this.state.selectedIncome._id + " - id not found")
                    }
                }
            })
        }
        else
        {
            income.paymentDate = this.state.date
            DataService.addAgentSalaryIncome(income,this.state.agent.idNumber, (response) => {

                if(response.result == true)
                {
                    this.state.incomes.push(response.data)
                    this.state.selectedIncome = null
                    this.setState(this.state)
                }
            })

         }
        Modal.hide()
    }
    onDeleteIncome(rowIndex)
    {
        DataService.deleteAgentSalaryIncome(this.state.incomes[rowIndex],this.state.agent.idNumber, (response) => {

            if(response.result == true)
            {
                this.state.incomes.splice(rowIndex, 1)
                this.state.selectedIncome = null
                this.setState(this.state)
            }
        })
    }

    //Manual income
    openExpenseModal(expense, index)
    {
        var expenseModalContent =  <ExpenseModalContent companies={companies}
                                                        commissionTypes={commissionTypes}
                                                        expense={expense}
                                                        expenseIndex={index}
                                                        onSaveExpense={this.onSaveExpense.bind(this)}/>

        Modal.showWithContent(expenseModalContent)
    }

    onNewExpense()
    {
        var expense = new Expense()
        this.openExpenseModal(expense,-1)
    }

    updateExpense(expenseId, updatedExpense)
    {
        for(var index = 0; index < this.state.expenses.length; index++)
        {
            if(this.state.expenses[index]._id === expenseId)
            {
                this.state.expenses[index] = updatedExpense
                return true
            }
        }
        return false
    }

    onSaveExpense(expense,index)
    {
        if(index != -1)
        {
            DataService.updateAgentSalaryExpense(this.state.selectedExpense._id,expense,this.state.agent.idNumber, (response) => {

                if(response.result == true)
                {
                    if(this.updateExpense(this.state.selectedExpense._id,response.data))
                    {
                        console.log("Expense with id " + this.state.selectedExpense._id + " updated successfully")
                        this.state.selectedExpense = null
                        this.setState(this.state)
                    }
                    else
                    {
                        console.log("ERROR while updating expense with id " + this.state.selectedExpense._id + " - id not found")
                    }
                 }
            })
        }
        else
        {
            expense.date = this.state.date
            DataService.addAgentSalaryExpense(expense,this.state.agent.idNumber, (response) => {

                if(response.result == true)
                {
                    this.state.expenses.push(response.data)
                    this.state.selectedExpense = null
                    this.setState(this.state)
                }
            })

        }
        Modal.hide()
    }
    onExpenseRowClick(index,expense)
    {
        //Save income before editing so we can refer to type even if it was edited
        this.state.selectedExpense = expense
        this.openExpenseModal(new Expense(expense),index)

    }
    onDeleteExpense(rowIndex)
    {
        DataService.deleteAgentSalaryExpense(this.state.expenses[rowIndex],this.state.agent.idNumber, (response) => {

            if(response.result == true)
            {
                this.state.expenses.splice(rowIndex, 1)
                this.state.selectedExpense = null
                this.setState(this.state)
            }
        })
    }

    sumOfIncomeWithType(type)
    {
        var sum = 0
        for(var index = 0; index < this.state.incomes.length; index++)
        {
            if(this.state.incomes[index].type === type)
            {
                sum += this.state.incomes[index].amount
            }
        }
        return sum
    }
    concatAllIncomes(incomes)
    {
        var allIncomes = []
        for(var type = 0; type < commissionTypes.length; type++)
        {
            var incomesOfType = incomes[commissionTypes[type]]
            if(incomesOfType != null)
            {
                allIncomes = allIncomes.concat(incomesOfType)
            }
        }
        return allIncomes
    }
    sumOfAllIncomes()
    {
        var sum = 0
        for(var index = 0; index < this.state.incomes.length; index++)
        {
            sum += this.state.incomes[index].amount
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
                title: "סה״כ תשלום",
                key: "amount",
                width: "col-33-33",
                type: 'read-only',
                format: "currency",
                color: 'normal'
            },
            {
                title: "הערות",
                key: "notes",
                width: "col-66-66",
                type: 'read-only',
                color: 'normal'
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
                type: 'read-only',
                color: 'normal'
            },
            {
                title: "הערות",
                key: "agentName",
                width: "col-33-33",
                type: 'read-only',
                color: 'normal'
            }
        ]

        var expenses = 0
        var incomesSum = this.sumOfAllIncomes()
        var salary = incomesSum - expenses
        var nifraim = this.sumOfIncomeWithType("נפרעים")
        var bonus = this.sumOfIncomeWithType("בונוס")
        var heikef = this.sumOfIncomeWithType("היקף")
        var manual = this.sumOfIncomeWithType("ידני")

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
                        <Table onRowClick={this.onIncomeRowClick.bind(this)}
                               onRemoveRow={this.onDeleteIncome.bind(this)}
                               columns={incomesColumns}
                               data={this.state.incomes}/>
                    </div>
                </div>

                <div className="agent-salary-page-table-box shadow">
                    <div className="agent-salary-page-table-box-top">
                        <div className="agent-salary-page-table-title">{strings.expenses}</div>
                        <Button className="shadow" onClick={this.onNewExpense.bind(this)} color="primary">{strings.newExpense}</Button>
                    </div>
                    <div className="agent-salary-page-expense-table">
                        <Table onRowClick={this.onExpenseRowClick.bind(this)}
                               onRemoveRow={this.onDeleteExpense.bind(this)}
                               columns={expensesColumns}
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