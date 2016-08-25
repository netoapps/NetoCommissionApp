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
import ExcelService from '../../../services/excel-service.js';

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
var expenseTypes = ["שכר","החזר הלוואות","הוצאות משרד","מקדמה","שונות"]
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
        key: "calculatedAmount",
        width: "col-33-33",
        type: 'read-only',
        format: "currency",
        color: 'normal'
    },
    {
        title: "גודל תיק",
        key: "portfolio",
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
        key: "type",
        width: "col-33-33",
        type: 'read-only',
        color: 'normal'
    },
    {
        title: "סה״כ",
        key: "amount",
        width: "col-33-33",
        type: 'read-only',
        format: "currency",
        color: 'normal'
    },
    {
        title: "הערות",
        key: "notes",
        width: "col-33-33",
        type: 'read-only',
        color: 'normal'
    }
]

class SalaryPage extends React.Component {

    constructor(props) {
        super(props);

        var date = new Date()
        var currentMonth = getMonthName(date.getMonth().toString());
        var currentYear = date.getFullYear().toString();
        var monthStartDate = new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0);
        var incomeComponentsSum = {}

        for(var type = 0; type < commissionTypes.length; type++)
        {
            incomeComponentsSum[commissionTypes[type]] = 0
        }

        this.state = {
            date: monthStartDate,
            selectedMonth: currentMonth,
            selectedYear:currentYear,
            incomes: [],
            expenses: [],
            incomeComponentsSum: incomeComponentsSum,
            incomeTotal: 0,
            expenseTotal: 0,
            salary: 0,
            portfolio: 0,
            agencyAmount: 0,
            newIncomeVisible: false,
            selectedIncome: null,
            selectedExpense: null,
        }
    }

    componentDidMount()
    {
        this.reloadDataWithDate(this.state.date)

    }
    componentWillUnmount()
    {

    }
    reloadDataWithDate(date)
    {
        this.state.date = date
        this.reloadData((incomes,manualIncomes, expenses, portfolio,incomeComponentsSum) => {

            this.state.incomes = incomes
            for(var index = 0; index < manualIncomes.length; index++)
            {
                this.state.incomes.push(manualIncomes[index])
            }
            this.state.expenses = expenses
            this.state.portfolio = portfolio
            this.state.incomeComponentsSum = incomeComponentsSum
            this.calculateAll()
            this.setState(this.state)
        })
    }
    calculateAll()
    {
        this.state.agencyAmount = this.calculateAgencyAmount()
        this.state.incomeTotal = this.sumOfAllIncomes()
        this.state.expenseTotal = this.sumOfAllExpenses()
        this.state.salary = this.state.incomeTotal - this.state.expenseTotal
    }
    reloadData(callback)
    {
        var date = this.state.date
        var promise = []
        promise.push(DataService.loadIncomeData(this.state.context.type,this.state.context.id,date))
        promise.push(DataService.loadManualIncomeData(this.state.context.type,this.state.context.id,date))
        promise.push(DataService.loadExpensesData(this.state.context.type,this.state.context.id,date))
        promise.push(DataService.loadPortfolioData(this.state.context.type,this.state.context.id,date))
        promise.push(DataService.loadIncomeComponentsSumData(this.state.context.type,this.state.context.id,date))
        Promise.all(promise).then(function (values) {
            callback(values[0],values[1],values[2],values[3],values[4])
        }).catch(function (reason){
            callback(null,null,null,null)
            console.log("failed to income data - " + reason)
        })
    }

    onMonthChange(month)
    {
        if(month != this.state.selectedMonth)
        {
            this.state.selectedMonth = month;
            this.state.date = new Date(this.state.date.getFullYear(), getMonthNumber(month), 1, 0, 0, 0, 0);
            this.reloadDataWithDate(this.state.date)

        }
    }
    onYearChange(year)
    {
        if(year != this.state.selectedYear)
        {
            this.state.selectedYear = year;
            this.state.date = new Date(year, this.state.date.getMonth(), 1, 0, 0, 0, 0);
            this.reloadDataWithDate(this.state.date)

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
            if(this.state.incomes[index].fileId == null)
            {
                if(this.state.incomes[index]._id === incomeId)
                {
                    this.state.incomes[index] = updatedIncome
                    return true
                }
            }
        }
        return false
    }

    onSaveIncome(income,index)
    {
        if(index != -1)
        {
            DataService.updateSalaryIncome(this.state.context.type,this.state.selectedIncome._id,income,this.state.context.id, (response) => {

                if(response.result == true)
                {
                    if(this.updateIncome(this.state.selectedIncome._id,response.data))
                    {
                        console.log("Income with id " + this.state.selectedIncome._id + " updated successfully")
                        this.state.selectedIncome = null
                        this.calculateAll()
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
            DataService.addSalaryIncome(this.state.context.type, income, this.state.context.id, (response) => {

                if(response.result == true)
                {
                    this.state.incomes.unshift(response.data)
                    this.state.selectedIncome = null
                    this.calculateAll()
                    this.setState(this.state)
                }
            })

         }
        Modal.hide()
    }
    onDeleteIncome(rowIndex)
    {
        swal({
                title: "אישור מחיקת הכנסה",
                text: "למחוק הכנסה זו לצמיתות מהמערכת?",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "כן, מחק את ההכנסה מהמערכת",
                cancelButtonText: "בטל",
                closeOnConfirm: false,
                showLoaderOnConfirm: false
            },
            function(isConfirm)
            {
                if (isConfirm)
                {
                    DataService.deleteSalaryIncome(this.state.context.type, this.state.incomes[rowIndex]._id,this.state.context.id, (response) => {

                        if(response.result == true)
                        {
                            swal(
                                {
                                    title: "",
                                    text: "ההכנסה נמחקה לצמיתות מהמערכת!",
                                    type: "success",
                                    timer: 1500,
                                    showConfirmButton: false
                                }
                            )
                            this.state.incomes.splice(rowIndex, 1)
                            this.state.selectedIncome = null
                            this.calculateAll()
                            this.setState(this.state)
                        }
                    })
                }
            }.bind(this));

    }

    //Manual income
    openExpenseModal(expense, index)
    {
        var expenseModalContent =  <ExpenseModalContent companies={companies}
                                                        expenseTypes={expenseTypes}
                                                        expense={expense}
                                                        expenseIndex={index}
                                                        onSaveExpense={this.onSaveExpense.bind(this)}/>

        Modal.showWithContent(expenseModalContent)
    }

    onNewExpense()
    {
        var expense = new Expense()
        expense.expenseDate = this.state.date
        expense.type = expenseTypes[0]
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

            DataService.updateSalaryExpense(this.state.context.type,this.state.selectedExpense._id,expense,this.state.context.id, (response) => {

                if(response.result == true)
                {
                    if(this.updateExpense(this.state.selectedExpense._id,response.data))
                    {
                        console.log("Expense with id " + this.state.selectedExpense._id + " updated successfully")
                        this.state.selectedExpense = null
                        this.calculateAll()
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
            expense.expenseDate = this.state.date
            DataService.addSalaryExpense(this.state.context.type,expense,this.state.context.id, (response) => {

                if(response.result == true)
                {
                    this.state.expenses.unshift(response.data)
                    this.state.selectedExpense = null
                    this.calculateAll()
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
        swal({
                title: "אישור מחיקת הוצאה",
                text: "למחוק הוצאה זו לצמיתות מהמערכת?",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "כן, מחק את ההוצאה מהמערכת",
                cancelButtonText: "בטל",
                closeOnConfirm: false,
                showLoaderOnConfirm: false
            },
            function(isConfirm)
            {
                if (isConfirm)
                {
                    DataService.deleteSalaryExpense(this.state.context.type,this.state.expenses[rowIndex]._id,this.state.context.id, (response) => {

                        if(response.result == true)
                        {
                            swal(
                                {
                                    title: "",
                                    text: "ההוצאה נמחקה לצמיתות מהמערכת!",
                                    type: "success",
                                    timer: 1500,
                                    showConfirmButton: false
                                }
                            )
                            this.state.expenses.splice(rowIndex, 1)
                            this.state.selectedExpense = null
                            this.calculateAll()
                            this.setState(this.state)
                        }
                    })
                }
            }.bind(this));

    }
    calculateAgencyAmount()
    {
        var sum = 0
        for(var index = 0; index < this.state.incomes.length; index++)
        {
            if(this.state.incomes[index].fileId != null)
                sum += parseFloat(this.state.incomes[index].agencyAmount)
        }
        return sum.toString()
    }
    sumOfIncomeWithType(type)
    {
        return this.state.incomeComponentsSum[type]
    }

    sumOfAllIncomes()
    {
        var sum = 0
        for(var type in this.state.incomeComponentsSum)
        {
            sum += parseFloat(this.state.incomeComponentsSum[type])
        }
        // for(var index = 0; index < this.state.incomes.length; index++)
        // {
        //     if(this.state.incomes[index].fileId == null )
        //     {
        //         sum += parseFloat(this.state.incomes[index].amount)
        //     }
        // }
        return sum.toString()
    }

    sumOfAllExpenses()
    {
        var sum = 0
        for(var index = 0; index < this.state.expenses.length; index++)
        {
            sum += this.state.expenses[index].amount
        }
        return sum
    }

    isEditableRow(rowData)
    {
        return (rowData.fileId == null)
    }
    onGenerateExcelFile()
    {
        var salary =
        {
            "שכר": this.state.salary,
        }
        for(var type = 0; type < commissionTypes.length; type++)
        {
            salary[commissionTypes[type]] = this.state.incomeComponentsSum[commissionTypes[type]]
        }
        var incomes = {
            columns: incomesColumns,
            data: this.state.incomes
        }
        var expenses = {
            columns: expensesColumns,
            data: this.state.expenses
        }
        var fullName = this.state.context.fullName
        ExcelService.generateSalaryReport(fullName,
            this.state.date,salary,this.state.agencyAmount,this.state.portfolio,incomes,expenses)
    }
    render () {

        var nifraim = this.sumOfIncomeWithType("נפרעים")
        var bonus = this.sumOfIncomeWithType("בונוס")
        var heikef = this.sumOfIncomeWithType("היקף")
        var manual = this.sumOfIncomeWithType("ידני")
        var fullName = this.state.context.fullName
        var salaryColor = this.state.salary >= 0 ? " green":" red"


        return (
            <div className="agent-salary-page animated fadeIn">

                <div className="hcontainer-no-wrap">
                    <MonthYearBox month={this.state.selectedMonth} year={this.state.selectedYear}
                                  onMonthChange={this.onMonthChange.bind(this)}
                                  onYearChange={this.onYearChange.bind(this)}/>
                    <div className="horizontal-spacer-10"/>
                    <div className="horizontal-spacer-10"/>
                    <div className="horizontal-spacer-10"/>
                    <Button className="shadow" onClick={this.onGenerateExcelFile.bind(this)} color="primary">{strings.generateExcelFile}</Button>
                </div>
                <div className="vertical-spacer-10"/>
                <div className="agent-salary-page-name-box shadow">{fullName}</div>
                <div className="vertical-spacer-10"/>
                <div className="vertical-spacer-10"/>

                <div className="hcontainer-no-wrap">
                    <div className="agent-salary-page-total-salary-box shadow">
                        <div className="agent-salary-page-box-title">{strings.totalSalary}</div>
                        <div className={"agent-salary-page-box-value" + salaryColor}><small>{"₪"}&nbsp;</small><b>{currencyFormattedString(this.state.salary.toString())}</b></div>
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
                            <div className="salary-page-expenses-horizontal-divider"/>
                            <div className="agent-salary-page-total-salary-sub-value-box">
                                <div className="agent-salary-page-total-salary-sub-value-box-title">{strings.expenses}</div>
                                <div className="agent-salary-page-total-salary-sub-value-box-value red"><small>{"₪"}&nbsp;</small><b>{currencyFormattedString(this.state.expenseTotal.toString())}</b></div>
                            </div>
                        </div>
                    </div>
                    <div className="horizontal-spacer-20"/>
                    <div className="agent-salary-page-total-portfolio-box shadow">
                        <div className="agent-salary-page-box-title">{strings.totalPortfolio}</div>
                        <div className="agent-salary-page-box-value green"><small>{"₪"}&nbsp;</small><b>{currencyFormattedString(this.state.portfolio.toString())}</b></div>
                    </div>
                    <div className="horizontal-spacer-20"/>
                    <div className="agent-salary-page-company-part-box shadow">
                        <div className="agent-salary-page-box-title">{strings.comapnyPart}</div>
                        <div className="agent-salary-page-box-value green"><small>{"₪"}&nbsp;</small><b>{currencyFormattedString(this.state.agencyAmount.toString())}</b></div>
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
                               data={this.state.incomes}
                               isEditableRow={this.isEditableRow.bind(this)}/>
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
                               data={this.state.expenses}/>
                    </div>
                </div>

            </div>
        );
    }
}

//Important!! This adds the router object to context
SalaryPage.contextTypes = {
    router: React.PropTypes.object.isRequired
}

export default SalaryPage;