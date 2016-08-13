import React from 'react';
import Table from './../common/table.jsx';
import AppStore from '../../stores/data-store'
import { strings } from '../../constants/strings'
import MonthYearBox from './../common/month-year-box.jsx'
import {getMonthName, getMonthNumber} from './../common/month-year-box.jsx'
import Button from 'muicss/lib/react/button'
import DataService from '../../services/data-service.js';
import {Modal} from './../common/app-modal.jsx';
import Income from './../../model/income.js';

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

class IncomeModalContent extends React.Component{
    constructor(props) {
        super(props);

       this.state = {
            companies:companies,
            commissionTypes:commissionTypes,
            incomeIndex: props.incomeIndex,
            income: this.setupIncome(props.income)
        }
    }
    componentWillReceiveProps(nextProps)
    {
        this.state.income = this.setupIncome(nextProps.income)
        this.setState(this.state)
    }
    setupIncome(income)
    {
        if (income == null) {
            income = new Income()
            income.company = companies[0]
            income.type = commissionTypes[0]
        }
        return income
    }
    onIncomeCompanyChange(index,value)
    {
        this.state.income.company = value
        this.setState(this.state)
    }
    onIncomeCommissionTypeChange(index,value)
    {
         this.state.income.type = value
        this.setState(this.state)
    }
    onIncomeAgentNumberChange(index,value)
    {
        this.state.income.agentInCompanyId = value
        this.setState(this.state)
    }
    onIncomeCommissionAmountChange(index,value)
    {
        this.state.income.amount = value
        this.setState(this.state)
    }
    onIncomeNoteChange(index,value)
    {
        this.state.income.notes = value
        this.setState(this.state)
    }
    onIncomeRepeatChange(index,value)
    {
        this.state.income.repeat = value
        this.setState(this.state)
    }
    onCancel()
    {
        Modal.hide()
    }
    onSave()
    {
        this.props.onSaveIncome(this.state.income,this.state.incomeIndex)
    }
    render(){

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
                title: "סה״כ תשלום",
                key: "amount",
                width: "col-33-33",
                type: 'input',
                color: 'normal',
                action: this.onIncomeCommissionAmountChange.bind(this),
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

        var modalTitle = strings.newIncome
        if(this.state.incomeIndex != -1)
            modalTitle = strings.editIncome

        return (
            <div className="income-modal">
                <div className="modal-title">{modalTitle}</div>
                <div className="income-modal-table">
                    <Table columns={columns}
                           data={[this.state.income]}/>
                </div>
                <div className="hcontainer-no-wrap">
                    <div className="horizontal-spacer-90"/>
                    <Button className="shadow" onClick={this.onCancel.bind(this)} color="default">{strings.cancel}</Button>
                    <div className="horizontal-spacer-20"/>
                    <Button className="shadow" onClick={this.onSave.bind(this)} color="primary">{strings.save}</Button>
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

        var incomes = {}
        for(var type = 0; type < commissionTypes.length; type++) {
            incomes[commissionTypes[type]] = []
        }

        this.state = {
            agent: AppStore.getAgentAtIndex(this.props.params.index),
            date: monthStartDate,
            selectedMonth: currentMonth,
            selectedYear:currentYear,
            incomes: incomes,
            manualIncomes: [],
            expenses: [],
            portfolio: "0",
            newIncomeVisible: false,
            selectedIncome: null,
            selectedExpense: null,
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
    openNewIncomeModal(income, index)
    {
        var newIncomeModal =  <IncomeModalContent income={income}
                                                  incomeIndex={index}
                                                  onSaveIncome={this.onSaveManualIncome.bind(this)}/>

        Modal.showWithContent(newIncomeModal)
    }
    onNewIncome()
    {
        this.openNewIncomeModal(new Income(),-1)
    }

    onManualIncomeRowClick(index,income)
    {
        //Save income before editing so we can refer to type even if it was edited
        this.state.selectedIncome = income
        this.openNewIncomeModal(new Income(income),index)
    }

    updateIncome(incomeId, updatedIncome)
    {
        for(var type = 0; type < commissionTypes.length; type++)
        {
            var incomesOfType = this.state.incomes[commissionTypes[type]]
            if(incomesOfType != null)
            {
                for(var incomeIndex = 0; incomeIndex < incomesOfType.length; incomeIndex++)
                {
                    if(incomesOfType[incomeIndex]._id === incomeId)
                    {
                        incomesOfType[incomeIndex] = updatedIncome
                        return true
                    }
                }
            }
        }
        return false
    }

    onSaveManualIncome(income,index)
    {
        if(index != -1)
        {
            if(this.updateIncome(this.state.selectedIncome._id,income))
            {
                console.log("Income with id " + this.state.selectedIncome._id + " updated successfully")
            }
            else
            {
                console.log("ERROR while updating income with id " + this.state.selectedIncome._id + " - id not found")
            }
            this.state.selectedIncome = null
            this.setState(this.state)
        }
        else
        {
            income.paymentDate = this.state.date
            // DataService.addManualIncome(income,this.state.agent.idNumber, (response) => {
            //
            //     if(response.result == true)
            //     {
            //         if(income != null)
            //         {
            //             this.state.incomes[this.state.selectedIncome.type].push(response.data)
            //         }
            //     }
            // this.state.incomes[income.type].push(income)
            // this.state.selectedIncome = null
            // this.setState(this.state)
            // })

            this.state.incomes[income.type].push(income)
            this.state.selectedIncome = null
            this.setState(this.state)
        }
        Modal.hide()
    }
    onRemoveIncome(rowIndex)
    {
        this.state.incomes[this.state.selectedIncome.type].splice(rowIndex, 1)
        this.state.selectedIncome = null
        this.setState(this.state)
    }
    onNewExpense()
    {

    }

    sumOfIncome(incomes)
    {
        var sum = 0
        if(incomes.length > 0)
        {
            for(var index = 0; index < incomes.length; index++)
            {
                sum += incomes[index].amount
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
    sumAllIncomes(incomes)
    {
        var sum = 0
        for(var type = 0; type < commissionTypes.length; type++)
        {
            var incomesOfType = incomes[commissionTypes[type]]
            if(incomesOfType != null)
            {
                sum +=  this.sumOfIncome(incomesOfType)
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
        var incomesSum = this.sumAllIncomes(this.state.incomes)
        var salary = incomesSum - expenses
        var incomesData = this.concatAllIncomes(this.state.incomes)
        var nifraim = this.sumOfIncome(this.state.incomes["נפרעים"])
        var bonus = this.sumOfIncome(this.state.incomes["בונוס"])
        var heikef = this.sumOfIncome(this.state.incomes["היקף"])
        var manual = this.sumOfIncome(this.state.incomes["ידני"])

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
                        <Table onRowClick={this.onManualIncomeRowClick.bind(this)}
                               onRemoveRow={this.onRemoveIncome.bind(this)}
                               columns={incomesColumns}
                               data={incomesData}/>
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