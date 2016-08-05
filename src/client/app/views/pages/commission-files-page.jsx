import React from 'react';
import Table from './../common/table.jsx';
import AppActions from '../../actions/app-actions'
import {ActionType} from '../../actions/app-actions.js'
import AppStore from '../../stores/data-store'

class EditFilesPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            commissionFiles: AppStore.getCommissionFiles()
        };
        this._reloadCommissionFiles = this.reloadCommissionFiles.bind(this)
    }

    componentDidMount()
    {
        AppStore.addEventListener(ActionType.COMMISSION_FILES_LOADED, this._reloadCommissionFiles);
        AppStore.addEventListener(ActionType.DELETE_COMMISSION_FILE_COMPLETED, this._reloadCommissionFiles);
    }

    componentWillUnmount()
    {
        AppStore.removeEventListener(ActionType.COMMISSION_FILES_LOADED,this._reloadCommissionFiles);
        AppStore.removeEventListener(ActionType.DELETE_COMMISSION_FILE_COMPLETED,this._reloadCommissionFiles);
    }

    reloadCommissionFiles()
    {
        this.state.commissionFiles = AppStore.getCommissionFiles()
        this.setState(this.state)
    }
    onDeleteFileClicked(rowIndex)
    {
        console.log("delete file at row " + rowIndex)

        var deleteInProgress = false;
        if(deleteInProgress)
            return;

        var fileName = this.state.commissionFiles[rowIndex].name

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
                                    text: "הקובץ נמחק לצמיתות מהמערכת!",
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
                key: "name",
                width: "col-33-33",
                type: 'button',
                color: 'blue',
                action: this.onFileNameClicked.bind(this)
            },
            {
                title: "חברה",
                key: "company",
                width: "col-33-33",
                type: 'read-only',
                color: 'normal'
            },
            {
                title: "חודש תשלום",
                key: "paymentDate",
                width: "col-33-33",
                type: 'month-year-date',
                color: 'normal'
            },
            {
                title: "תאריך העלאה",
                key: "uploadDate",
                width: "col-33-33",
                type: 'full-date',
                color: 'normal'
            },
            {
                title: "מע״מ",
                key: "taxState",
                width: "col-33-33",
                type: 'read-only',
                color: 'normal'
            },
            {
                title: "הערות",
                key: "note",
                width: "col-33-33",
                type: 'read-only',
                color: 'normal'
            }
        ]

        return (
            <div className="edit-files-page animated fadeIn">
                <div className="edit-files-table shadow">
                    <Table onRemoveRow={this.onDeleteFileClicked.bind(this)} columns={columns} data={this.state.commissionFiles}/>
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