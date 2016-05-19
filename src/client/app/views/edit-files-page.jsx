import React from 'react';
import AuthService from '../services/auth-service'
import Table from './table.jsx';

class EditFilesPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loginData: AuthService.getLoginData()
        };

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

        var data = [
            {fileName: "ילין לפידות.xlsx", companyName: "ילין לפידות", paymentMonth: "04/16", uploadDate: "01/04/16"},
            {fileName: "ילין לפידות.xlsx", companyName: "ילין לפידות", paymentMonth: "04/16", uploadDate: "01/04/16"},
            {fileName: "ילין לפידות.xlsx", companyName: "ילין לפידות", paymentMonth: "04/16", uploadDate: "01/04/16"}
        ]

        return (
            <div className="edit-files-page animated fadeIn">
                <div className="edit-files-table shadow">
                    <Table columns={columns}
                           data={data}/>
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