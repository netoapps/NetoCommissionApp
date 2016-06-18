import React from 'react';
import AuthService from '../../services/auth-service'
import Table from './../common/table.jsx';
import AppActions from '../../actions/app-actions'
import AppStore from '../../stores/data-store'
import {ActionType} from '../../actions/app-actions.js'

class EditFilesPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            loginData: AuthService.getLoginData(),
            filesData: AppStore.getCommissionFiles()
        };
    }

    componentDidMount()
    {
        AppStore.addEventListener(ActionType.DELETE_COMMISSION_DOC, this.onDeleteFile.bind(this));
    }

    componentWillUnmount()
    {
        AppStore.removeEventListener(ActionType.DELETE_COMMISSION_DOC,this.onDeleteFile);
    }
    onDeleteFile()
    {
        this.state.filesData = AppStore.getCommissionFiles()
        this.setState(this.state)
    }
    onDeleteFileClicked(rowIndex)
    {
        console.log("delete file at row " + rowIndex)

        var deleteInProgress = false;
        if(deleteInProgress)
            return;

        var fileName = this.state.filesData[rowIndex].fileName

        swal({
                title: "אישור מחיקת מסמך",
                text: "למחוק מסמך זה לצמיתות מהמערכת?",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "כן, מחק את המסמך מהמערכת",
                cancelButtonText: "בטל",
                closeOnConfirm: false,
                showLoaderOnConfirm: false
            },
            function(isConfirm)
            {
                if (isConfirm)
                {
                    AppActions.deleteCommissionFile(fileName,function (status)
                    {
                        if(status == 'success')
                        {
                            swal(
                                {
                                    title: "",
                                    text: "המסמך נמחק לצמיתות מהמערכת!",
                                    type: "success",
                                    timer: 1500,
                                    showConfirmButton: false
                                }
                            )
                            console.log('Data was deleted successfully from server!');
                        }
                        else
                            console.error('Error while deleting data from server!');
                        deleteInProgress = true;
                    });
                }
            });
    }
    onFileNameClicked(rowIndex)
    {
        console.log("download file at row " + rowIndex)
    }

    render () {

        var columns = [

            {
                title: "שם קובץ",
                key: "fileName",
                width: "col-33-33",
                type: 'read-only-button',
                color: 'blue',
                action: this.onFileNameClicked.bind(this)
            },
            {
                title: "חברה",
                key: "companyName",
                width: "col-33-33",
                type: 'read-only',
                color: 'normal'
            },
            {
                title: "חודש תשלום",
                key: "paymentMonth",
                width: "col-33-33",
                type: 'read-only',
                color: 'normal'
            },
            {
                title: "תאריך העלאה",
                key: "uploadDate",
                width: "col-33-33",
                type: 'read-only',
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

        return (
            <div className="edit-files-page animated fadeIn">
                <div className="edit-files-table shadow">
                    <Table onRemoveRow={this.onDeleteFileClicked.bind(this)} columns={columns} data={this.state.filesData}/>
                </div>
            </div>
        );
    }
}

//Important!! This adds the router object to context
EditFilesPage.contextTypes = {
    router: React.PropTypes.object.isRequired
}

export default EditFilesPage;