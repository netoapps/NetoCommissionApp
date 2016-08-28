import React from 'react';
import { strings } from '../../constants/strings'
import Table from './../common/table.jsx';
import AppStore from '../../stores/data-store'
import DataService from '../../services/data-service.js';
import AppActions from '../../actions/app-actions'
import Button from 'muicss/lib/react/button'


class SettingsPage extends React.Component {

    constructor(props) {
        super(props);

        var companies = []
        var dbCompanies = AppStore.getCompanies()
        for(var company = 0; company < dbCompanies.length; company++)
        {
            companies.push({ companyName: dbCompanies[company]})
        }
        this.state = {
            data: companies
        }
    }
    onCompanyNameChange(index,value)
    {
        this.state.data[index].companyName = value
        this.setState(this.state)
    }
    onNewCompanyRow()
    {
        this.state.data.unshift({companyName: ""})
        this.setState(this.state)
    }
    onDeleteCompanyRowClicked(rowIndex)
    {
        this.state.data.splice(rowIndex, 1)
        this.setState(this.state)
    }
    onExitClicked()
    {
        this.context.router.goBack()
    }
    onSaveClicked()
    {
        var companies = []
        for(var company = 0; company < this.state.data.length; company++)
        {
            var testName = this.state.data[company].companyName.replace(/\s+/g, '');
            if(testName!= null && testName.length > 0)
            {
                companies.push( this.state.data[company].companyName )
            }
        }
        AppActions.updateCompanies(companies,(response) => {
            if(response.result)
            {
                swal(
                    {
                        title: "",
                        text: "חברות נשמרו בהצלחה",
                        type: "success",
                        timer: 1500,
                        showConfirmButton: false
                    })
                this.context.router.goBack()
            }
            else
            {
                swal({
                    title: "שגיאה",
                    text: "שגיאה בעת שמירת חברות בשרת",
                    type: "error",
                    showCancelButton: false,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "סגור",
                    closeOnConfirm: true,
                    showLoaderOnConfirm: false
                });
            }

        })
    }
    render () {

        var columns = [

            {
                title: "חברות",
                key: "companyName",
                width: "100%",
                type: 'input',
                color: 'normal',
                action: this.onCompanyNameChange.bind(this)
            }
        ]

        return (
            <div className="page animated fadeIn shadow">
                <div className="settings-page-companies-table">
                    <Button className="shadow" onClick={this.onNewCompanyRow.bind(this)} color="primary">{strings.newCompany}</Button>
                    <Table heightClass="settings-page-companies-table-height"
                           onRemoveRow={this.onDeleteCompanyRowClicked.bind(this)}
                           columns={columns}
                           data={this.state.data}/>
                    <div className="vertical-spacer-10"/>
                 </div>
                <div className="hcontainer-no-wrap">
                    <div className="horizontal-spacer-90"/>
                    <Button className="shadow" onClick={this.onExitClicked.bind(this)} color="default">{strings.exit}</Button>
                    <div className="horizontal-spacer-20"/>
                    <Button className="shadow" onClick={this.onSaveClicked.bind(this)} color="primary">{strings.save}</Button>
                </div>
            </div>
        );
    }
}

//Important!! This adds the router object to context
SettingsPage.contextTypes = {
    router: React.PropTypes.object.isRequired
}


export default SettingsPage;