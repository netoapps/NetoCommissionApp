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
            companies.push(
                {
                    companyName: dbCompanies[company],
                    companyId: AppStore.getCompanyIdFromName(dbCompanies[company]),
                    isModified: false,
                    isNew: false
                })
        }
        this.state = {
            dbCompanies: dbCompanies,
            companies: companies,
            deletedCompanies: []
        }
    }
    onCompanyNameChange(index,value)
    {
        this.state.companies[index].companyName = value
        this.state.companies[index].isModified = true
        this.setState(this.state)
    }
    onNewCompanyRow()
    {
        this.state.companies.unshift({
            companyName: "",
            companyId: "",
            isModified: true,
            isNew: true
        })
        this.setState(this.state)
    }
    onDeleteCompanyRowClicked(rowIndex)
    {
        swal({
                title: "אישור מחיקה",
                text: 'למחוק חברה ' + this.state.companies[rowIndex].companyName + "?",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "המשך",
                cancelButtonText: "ביטול",
                closeOnConfirm: true,
                closeOnCancel: true
            },
            function(isConfirm) {
                if (isConfirm) {
                    var deleted = this.state.companies[rowIndex]
                    this.state.companies.splice(rowIndex, 1)
                    this.state.deletedCompanies.push(deleted)
                    this.setState(this.state)
                }
            }.bind(this))
    }
    onExitClicked()
    {
        this.context.router.goBack()
    }
    onSaveClicked()
    {
        var promise = []
        var isNameValid = function(name)
        {
            var testName = name.replace(/\s+/g, '');
            return (testName != null && testName.length > 0)
        }
        var company = null
        for(var index = 0; index < this.state.companies.length; index++)
        {
            company = this.state.companies[index]
            if(company.isModified || company.isNew) {
                for (var dbIndex = 0; dbIndex < this.state.dbCompanies.length; dbIndex++) {
                    var dbCompany = this.state.dbCompanies[dbIndex]
                    if((dbCompany.companyName === company.companyName) && (dbCompany.companyId != company.companyId))
                    {
                        swal({
                            title: "שגיאה",
                            text:  dbCompany.companyName + "שגיאה בעת שמירת חברות בשרת, שם חברה קיים - ",
                            type: "error",
                            showCancelButton: false,
                            confirmButtonColor: "#DD6B55",
                            confirmButtonText: "סגור",
                            closeOnConfirm: true,
                            showLoaderOnConfirm: false
                        });
                        return
                    }
                }
            }
        }
        for(index = 0; index < this.state.companies.length; index++)
        {
            company = this.state.companies[index]
            if(!isNameValid(company.companyName))
            {
                console.error("Invalid company name found!")
                continue
            }
            if(company.isNew)
            {
                promise.push(AppStore.addCompany(company.companyName))
            }
            else if(company.isModified)
            {
                promise.push(AppStore.updateCompanyName(company.companyId, company.companyName))
            }
        }
        for(index = 0; index < this.state.deletedCompanies.length; index++)
        {
            company = this.state.deletedCompanies[index]
            if(!isNameValid(company.companyName))
            {
                console.error("Invalid company name found!")
                continue
            }
            promise.push(AppStore.deleteCompany(company.companyId))
        }
        Promise.all(promise).then(function (values)
        {
            swal(
                {
                    title: "",
                    text: "חברות נשמרו בהצלחה",
                    type: "success",
                    timer: 1500,
                    showConfirmButton: false
                })
            AppActions.loadCompanies()
        }).catch(function (reason)
        {
            console.error("Failed to update companies - " + reason)
            swal({
                  title: "שגיאה",
                  text: reason.message + "שגיאה בעת שמירת חברות בשרת - ",
                  type: "error",
                  showCancelButton: false,
                  confirmButtonColor: "#DD6B55",
                  confirmButtonText: "סגור",
                  closeOnConfirm: true,
                  showLoaderOnConfirm: false
            });
        })




        // AppActions.reloadCompanies(companies,(response) => {
        //     if(response.result)
        //     {
        //         swal(
        //             {
        //                 title: "",
        //                 text: "חברות נשמרו בהצלחה",
        //                 type: "success",
        //                 timer: 1500,
        //                 showConfirmButton: false
        //             })
        //         this.context.router.goBack()
        //     }
        //     else
        //     {
        //         swal({
        //             title: "שגיאה",
        //             text: "שגיאה בעת שמירת חברות בשרת",
        //             type: "error",
        //             showCancelButton: false,
        //             confirmButtonColor: "#DD6B55",
        //             confirmButtonText: "סגור",
        //             closeOnConfirm: true,
        //             showLoaderOnConfirm: false
        //         });
        //     }
        //
        // })
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
                           data={this.state.companies}/>
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