/**
 * Created by asaf on 25/04/2016.
 */
import Store from '../lib/store.js';
import dispatcher from '../dispatcher/app-dispatcher.js';
import Actions from '../actions/app-actions.js';
import {ActionType} from '../actions/app-actions.js';

class DataStore extends Store {

    constructor() {
        super('DataStore');
        this.logger.debug('Initializing DataStore');
        this.initialize('user', {});

        var files = [
            {fileName: "ילין לפידות.xlsx", companyName: "ילין לפידות", paymentMonth: "04/16", uploadDate: "01/04/16", notes: "במבה קטנה" },
            {fileName: "ילין לפידות.xlsx", companyName: "ילין לפידות", paymentMonth: "04/16", uploadDate: "01/04/16", notes: "במבה קטנה ויפה"},
            {fileName: "ילין לפידות.xlsx", companyName: "ילין לפידות", paymentMonth: "04/16", uploadDate: "01/04/16", notes: "במבה קטנה ושמנמנה"}
        ]
        this.initialize('files',files);
    }

    getFilesData()
    {
        return this.get('files');
    }

    deleteFile(data)
    {
        var files = this.get('files')

        for(var file = 0; file < files.length; file++)
        {
            if(data.fileName === files[file].fileName)
            {
                files.splice(file, 1);
                data.callback("success")
                this.logger.debug('delete doc ' + data.fileName);
                this.eventbus.emit(ActionType.DELETE_COMMISSION_DOC);
                break;
            }
        }
    }

    /* Handle actions */
    onAction(actionType, data)
    {
        this.logger.debug('Received Action ${actionType} with data', data);
        switch (actionType)
        {
            case ActionType.DELETE_COMMISSION_DOC:
                this.deleteFile(data)
                break;
        }
    }
}

var dataStore = new DataStore();
dispatcher.registerStore(dataStore);
export default dataStore;
