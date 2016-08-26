import React from 'react';
import Table from '../../common/table.jsx';
import { strings } from '../../../constants/strings'
import Button from 'muicss/lib/react/button'
import {Modal} from '../../common/app-modal.jsx';
import Expense from '../../../model/expense.js';

export default class ExpenseModalContent extends React.Component
{
    constructor(props) {
        super(props);

        this.state = {
            companies:props.companies,
            expenseTypes:props.expenseTypes,
            expenseIndex: props.expenseIndex,
            expense: this.setupExpense(props.expense)
        }
    }
    componentWillReceiveProps(nextProps)
    {
        this.state.expense = this.setupExpense(nextProps.expense)
        this.setState(this.state)
    }
    setupExpense(expense)
    {
        if (expense == null) {
            expense = new Expense()
            expense.type = props.expenseTypes[0]
        }
        return expense
    }

    onExpenseTypeChange(index,value)
    {
        this.state.expense.type = value
        this.setState(this.state)
    }

    onExpenseAmountChange(index,value)
    {
        this.state.expense.amount = value
        this.setState(this.state)
    }
    onExpenseNoteChange(index,value)
    {
        this.state.expense.notes = value
        this.setState(this.state)
    }
    onExpenseRepeatChange(index,value)
    {
        this.state.expense.repeat = value
        this.setState(this.state)
    }
    onCancel()
    {
        Modal.hide()
    }
    onSave()
    {
        this.props.onSaveExpense(this.state.expense,this.state.expenseIndex)
    }
    render(){

        var columns = [

            {
                title: "סוג הוצאה",
                key: "type",
                width: "33%",
                type: 'select',
                color: 'normal',
                action: this.onExpenseTypeChange.bind(this),
                options: this.state.expenseTypes
            },
            {
                title: "סה״כ",
                key: "amount",
                width: "33%",
                type: 'input',
                color: 'normal',
                action: this.onExpenseAmountChange.bind(this),
            },
            {
                title: "מחזוריות",
                key: "repeat",
                width: "33%",
                type: 'input',
                color: 'normal',
                action: this.onExpenseRepeatChange.bind(this)
            },
            {
                title: "הערות",
                key: "notes",
                width: "66%",
                type: 'input',
                color: 'normal',
                action: this.onExpenseNoteChange.bind(this)
            }
        ]

        var modalTitle = strings.newExpense
        if(this.state.expenseIndex != -1)
            modalTitle = strings.editExpense

        return (
            <div className="expense-modal">
                <div className="modal-title">{modalTitle}</div>
                <div className="expense-modal-table">
                    <Table columns={columns}
                           data={[this.state.expense]}/>
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