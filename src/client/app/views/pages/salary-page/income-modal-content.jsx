import React from 'react';
import Table from '../../common/table.jsx';
import { strings } from '../../../constants/strings'
import Button from 'muicss/lib/react/button'
import {Modal} from '../../common/app-modal.jsx';
import Income from '../../../model/income.js';
import AppStore from '../../../stores/data-store.js';

export default class IncomeModalContent extends React.Component
{
    constructor(props) {
        super(props);

        this.state = {
            companies:props.companies,
            commissionTypes:props.commissionTypes,
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
            income.company = props.companies[0]
            income.type = props.commissionTypes[0]
        }
        return income
    }
    onSelectCompany(index,value)
    {
        this.state.income.company = AppStore.getCompanyIdFromName(value)
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
    onRequestCompanyCellData(rowIndex, title)
    {
        var companyId = this.state.income.company
        var companyName =  AppStore.getCompanyNameFromId(companyId)
        if (companyName == null)
        {
            console.error("Income modal content - could not convert company name from id " + companyId)
        }
        return companyName
    }
    render(){

        var columns = [
            {
                title: "חברה",
                key: "-request-",
                width: "20%",
                type: 'select-request',
                color: 'normal',
                action: this.onSelectCompany.bind(this),
                options: this.state.companies,
                requestCellData: this.onRequestCompanyCellData.bind(this),
            },
            {
                title: "מספר סוכן",
                key: "agentInCompanyId",
                width: "10%",
                type: 'input',
                color: 'normal',
                action: this.onIncomeAgentNumberChange.bind(this)
            },
            {
                title: "סוג תשלום",
                key: "type",
                width: "15%",
                type: 'select',
                color: 'normal',
                action: this.onIncomeCommissionTypeChange.bind(this),
                options: this.state.commissionTypes
            },
            {
                title: "סה״כ תשלום",
                key: "amount",
                width: "10%",
                type: 'input',
                color: 'normal',
                action: this.onIncomeCommissionAmountChange.bind(this),
            },
            {
                title: "מחזוריות",
                key: "repeat",
                width: "10%",
                type: 'input',
                color: 'normal',
                action: this.onIncomeRepeatChange.bind(this)
            },
            {
                title: "הערות",
                key: "notes",
                width: "35%",
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