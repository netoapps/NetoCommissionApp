import React from 'react';
import AuthService from '../services/auth-service'
import Table from './table.jsx';
import AppActions from '../actions/app-actions'
import AppStore from '../stores/data-store'
import {ActionType} from '../actions/app-actions.js';

class EditFilesPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            loginData: AuthService.getLoginData(),
            filesData: AppStore.getFilesData()
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
        this.state.filesData = AppStore.getFilesData()
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
    onDownloadFileClicked(rowIndex)
    {
        console.log("download file at row " + rowIndex)
    }

    render () {

        var columns = [

            {
                title: "שם קובץ",
                key: "fileName",
                width: "col-33-33",
                type: 'read-only',
                color: 'normal'
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
            },
            {
                title: "פעולות",
                key: "actions",
                width: "col-33-33",
                type: 'action',
                color: 'normal'
            }
            //},
            //{
            //    title: "הורדת קובץ",
            //    width: "col-33-33",
            //    type: 'button',
            //    color: 'normal'
            //},
            //{
            //    title: "מחיקת קובץ",
            //    width: "col-33-33",
            //    type: 'button',
            //    color: 'normal'
            //}

        ]

        var deleteAction = {name: "מחק", action: this.onDeleteFileClicked.bind(this),color: "red"}
        var downloadAction = {name: "הורד", action: this.onDownloadFileClicked.bind(this),color: "blue"}

        var filesData = []
        for(var file = 0; file < this.state.filesData.length; file++)
        {
            var fileData = this.state.filesData[file]
            fileData["actions"] = [downloadAction,deleteAction]
            filesData.push(fileData)
        }

        return (
            <div className="edit-files-page animated fadeIn">
                <div className="edit-files-table shadow">
                    <Table columns={columns}
                           data={filesData}/>
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