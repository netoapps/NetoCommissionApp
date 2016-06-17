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


        var agents = [
            {
                name: "קרין",
                familyName: "בוזלי לוי",
                idNumber: "112233445",
                phoneNumber: "0521510677",
                faxNumber: "0521510677",
                email: "karin@neto-finance.co.il",
                active: true,
                companies: [
                    {companyName: "מגדל", agentNumber: "2342234523",paymentType: "נפרעים",  agentPart: "55%", agencyPart: "45%"},
                    {companyName: "אלטשולר שחם", agentNumber: "234234",paymentType: "היקף",  agentPart: "55%", agencyPart: "45%"},
                    {companyName: "מנורה", agentNumber: "789565",paymentType: "בונוס",  agentPart: "55%", agencyPart: "45%"}
                ]
            },
            {
                name: "עידן",
                familyName: "כץ",
                idNumber: "34421134",
                phoneNumber: "0506774836",
                faxNumber: "048323746",
                email: "idan@neto-finance.co.il",
                active: true,
                companies: [
                    {companyName: "מגדל", agentNumber: "57546",paymentType: "נפרעים",  agentPart: "55%", agencyPart: "45%"},
                    {companyName: "אלטשולר שחם", agentNumber: "231",paymentType: "היקף",  agentPart: "55%", agencyPart: "45%"},
                    {companyName: "כלל", agentNumber: "6865",paymentType: "היקף",  agentPart: "55%", agencyPart: "45%"},
                    {companyName: "מנורה", agentNumber: "9789",paymentType: "בונוס",  agentPart: "55%", agencyPart: "45%"}
                ]
            },
            {
                name: "תומר",
                familyName: "משהו",
                idNumber: "22343452",
                phoneNumber: "0546747636",
                faxNumber: "049324232",
                email: "tomer@neto-finance.co.il",
                active: false,
                companies: [
                    {companyName: "מגדל", agentNumber: "54633",paymentType: "נפרעים",  agentPart: "55%", agencyPart: "45%"},
                    {companyName: "אלטשולר שחם", agentNumber: "2342",paymentType: "היקף",  agentPart: "55%", agencyPart: "45%"},
                    {companyName: "מנורה", agentNumber: "678678",paymentType: "בונוס",  agentPart: "55%", agencyPart: "45%"}
                ]
            }
        ]
        this.initialize('agents',agents);

        var partnershipsData = [
            {
                partnersId: ["112233445","34421134"],
                active: true
            },
            {
                partnersId: ["34421134","22343452"],
                active: false
            },
            {
                partnersId: ["22343452","112233445"],
                active: true
            }
        ]

        this.initialize('partnerships',partnershipsData);


    }

    getCommissionFiles()
    {
        return this.get('files');
    }
    getAgents()
    {
        return this.get('agents');
    }
    getAgent(idNumber)
    {
        var agents =  this.get('agents');

        for (var agent = 0; agent < agents.length ;agent++)
        {
            if (agents[agent].idNumber === idNumber)
                return agents[agent]
        }
        return null
    }
    getPartnerships()
    {
        return this.get('partnerships');
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
