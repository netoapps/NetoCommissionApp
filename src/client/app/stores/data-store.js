/**
 * Created by asaf on 25/04/2016.
 */
import Store from '../lib/store.js';
import dispatcher from '../dispatcher/app-dispatcher.js';
import Actions from '../actions/app-actions.js';
import {ActionType} from '../actions/app-actions.js';
import {Agent,AgentPaymentDetails} from '../model/agent.js';
import {Partnership,PartnershipPaymentDetails, PartnershipAgentDetails} from '../model/partnership.js';
import {CommissionFile} from '../model/commission-file.js';
import { strings } from '../constants/strings'

class DataStore extends Store {

    constructor() {
        super('DataStore');
        this.logger.debug('Initializing DataStore');
        this.initialize('user', {});



        var companies = ["כלל ביטוח","כלל גמל","מגדל","מנורה","אלטשולר שחם","ילין לפידות","מיטב דש","הראל","הפניקס","אנליסט","איי בי איי","אקסלנס","הכשרה"]
        this.initialize('companies',companies);

        //1 - agent number in company
        //2 - godel tik
        //3 - nifraim
        //4 - hekef
        //5 - bonus
        var commissionType = ["היקף","נפרעים","בונוס"]
        this.initialize('commissionType',commissionType);

        this.setDummyData()
    }

    setDummyData() {

        var file1 = new CommissionFile()
        file1.company = "כלל"
        file1.name = "כלל קבצים בעמ.xls";
        file1.paymentDate = new Date();
        file1.uploadDate = new Date();
        file1.note = "אחלה קובץ";
        file1.taxState = strings.taxIncluded;
        file1.taxValue = "";

        var file2 = new CommissionFile()
        file2.company = "מגדל"
        file2.name = "מגדל עמלות סוכנים.xls";
        file2.paymentDate = new Date();
        file2.uploadDate = new Date();
        file2.note = "קובץ עם הרבה עמלות";
        file2.taxState = strings.taxNotIncluded;
        file2.taxValue = "17";

        var file3 = new CommissionFile()
        file3.company = "אלטשולר שחם"
        file3.name = "אלטשולר-שחם-עמלות-נטו.xls";
        file3.paymentDate = new Date();
        file3.uploadDate = new Date();
        file3.note = "הקובץ מכיל גם מע״מ";
        file3.taxState = strings.taxNotIncluded;
        file3.taxValue = "17";

        var files = [file1,file2,file3]
        this.initialize('files', files);

        //defaults
        //nifraim - 70(agent) 30(company)
        //heikef - 55(agent) 45(company)
        //bonus - 50(agent) 50(company)
        var agents = []


        var karinPayments = []
        karinPayments.push(new AgentPaymentDetails( {companyName: "מגדל", agentNumber: "2342234523",paymentType: "נפרעים",  agentPart: "55", agencyPart: "45"}  ))
        karinPayments.push(new AgentPaymentDetails( {companyName: "אלטשולר שחם", agentNumber: "234234",paymentType: "היקף",  agentPart: "55", agencyPart: "45"}  ))
        karinPayments.push(new AgentPaymentDetails( {companyName: "מנורה", agentNumber: "789565",paymentType: "בונוס",  agentPart: "55", agencyPart: "45"}  ))
        agents.push(new Agent({
            name: "קרין",
            familyName: "בוזלי לוי",
            idNumber: "112233445",
            phoneNumber: "0521510677",
            faxNumber: "0521510677",
            email: "karin@neto-finance.co.il",
            active: true,
            paymentsDetails: karinPayments
        }))


        var idanPayments = []
        idanPayments.push(new AgentPaymentDetails( {companyName: "מגדל", agentNumber: "57546",paymentType: "נפרעים",  agentPart: "55", agencyPart: "45"}  ))
        idanPayments.push(new AgentPaymentDetails( {companyName: "אלטשולר שחם", agentNumber: "231",paymentType: "היקף",  agentPart: "55", agencyPart: "45"}  ))
        idanPayments.push(new AgentPaymentDetails( {companyName: "כלל", agentNumber: "6865",paymentType: "היקף",  agentPart: "55", agencyPart: "45"}  ))
        idanPayments.push(new AgentPaymentDetails( {companyName: "מנורה", agentNumber: "9789",paymentType: "בונוס",  agentPart: "55", agencyPart: "45"}  ))
        agents.push(new Agent({
            name: "עידן",
            familyName: "כץ",
            idNumber: "34421134",
            phoneNumber: "0506774836",
            faxNumber: "048323746",
            email: "idan@neto-finance.co.il",
            active: true,
            paymentsDetails: idanPayments
        }))

        var tomerPayments = []
        tomerPayments.push(new AgentPaymentDetails( {companyName: "מגדל", agentNumber: "54633",paymentType: "נפרעים",  agentPart: "55", agencyPart: "45"}  ))
        tomerPayments.push(new AgentPaymentDetails( {companyName: "אלטשולר שחם", agentNumber: "2342",paymentType: "היקף",  agentPart: "55", agencyPart: "45"}  ))
        tomerPayments.push(new AgentPaymentDetails( {companyName: "מנורה", agentNumber: "678678",paymentType: "בונוס",  agentPart: "55", agencyPart: "45"}  ))
        agents.push(new Agent({
            name: "תומר",
            familyName: "כהן",
            idNumber: "22343452",
            phoneNumber: "0546747636",
            faxNumber: "049324232",
            email: "tomer@neto-finance.co.il",
            active: false,
            paymentsDetails: tomerPayments
        }))

        agents.push(new Agent({
            name: "חומוס",
            familyName: "משאושה",
            idNumber: "67865443",
            phoneNumber: "",
            faxNumber: "049324232",
            email: "tomer@neto-finance.co.il",
            active: false,
            paymentsDetails: []

        }))


        this.initialize('agents',agents);

        var partnership1 = new Partnership()
        partnership1.active = true
        var partnershipAgentDetails10 = new PartnershipAgentDetails()
        var partnershipAgentDetails11 = new PartnershipAgentDetails()
        partnershipAgentDetails10.idNumber = "112233445"
        partnershipAgentDetails10.part = "64"
        partnershipAgentDetails11.idNumber = "34421134"
        partnershipAgentDetails11.part = "36"
        partnership1.agentsDetails = [partnershipAgentDetails10,partnershipAgentDetails11]
        partnership1.paymentsDetails.push({companyName: "מגדל", partnershipNumber: "789674",paymentType: "נפרעים",  partnershipPart: "55", agencyPart: "45"})
        partnership1.paymentsDetails.push({companyName: "כלל", partnershipNumber: "34243254",paymentType: "בונוס",  partnershipPart: "58", agencyPart: "42"})
        partnership1.paymentsDetails.push({companyName: "מנורה", partnershipNumber: "546786",paymentType: "היקף",  partnershipPart: "45", agencyPart: "65"})

        var partnership2 = new Partnership()
        partnership2.active = false
        var partnershipAgentDetails20 = new PartnershipAgentDetails()
        var partnershipAgentDetails21 = new PartnershipAgentDetails()
        partnershipAgentDetails20.idNumber = "67865443"
        partnershipAgentDetails20.part = "50"
        partnershipAgentDetails21.idNumber = "34421134"
        partnershipAgentDetails21.part = "50"
        partnership2.agentsDetails = [partnershipAgentDetails21,partnershipAgentDetails20]
        partnership2.paymentsDetails.push({companyName: "מגדל", partnershipNumber: "234234",paymentType: "נפרעים",  partnershipPart: "55", agencyPart: "45"})
        partnership2.paymentsDetails.push({companyName: "כלל", partnershipNumber: "6786",paymentType: "בונוס",  partnershipPart: "58", agencyPart: "42"})
        partnership2.paymentsDetails.push({companyName: "מנורה", partnershipNumber: "78977655",paymentType: "היקף",  partnershipPart: "45", agencyPart: "65"})
        var partnershipsData = [partnership1,partnership2]
        this.initialize('partnerships',partnershipsData);
    }

    //Companies
    getCompanies()
    {
        return this.get('companies');
    }

    //Commissions
    getCommissionTypes()
    {
        return this.get('commissionType');
    }
    getCommissionFiles()
    {
        return this.get('files');
    }

    //Agents
    getAgents()
    {
        return this.get('agents');
    }
    addAgent(agent)
    {
        var agents = this.getAgents()
        agents.push(agent)

        //post to server...
        $.ajax(
            {
                url: '/agent',
                type: 'POST',
                data: agent,
                contentType: 'application/json',
                success: function()
                {
                    console.log('addAgent - Server responded with success!');
                    if(callback != null)
                        callback('success');
                }.bind(this),
                error: function(jqXHR, textStatus, errorThrown)
                {
                    console.error('generate-pdf/', textStatus, errorThrown.toString());
                    if(callback != null)
                        callback('error');
                }.bind(this)
            });
    }
    deleteAgentAtIndex(index)
    {
        var agents = this.getAgents()
        if (agents.length > index)
        {
            agents.splice(index, 1)
            this.eventbus.emit(ActionType.DELETE_AGENT);
            this.logger.debug('Delete agent at index ' + index);

            //post change to server...
        }
    }
    setAgentAtIndex(index, agent)
    {
        var agents = this.getAgents()
        if (agents.length > index)
        {
            agents[index] = agent
            this.eventbus.emit(ActionType.UPDATE_AGENT);
            this.logger.debug('Updated agent at index ' + index);

            //post change to server...
        }
    }
    getAgentAtIndex(index)
    {
        var agents = this.getAgents();
        if (agents.length > index)
        {
            return agents[index]
        }
        return null
    }
    getAgent(idNumber)
    {
        var agents = this.getAgents();
        for (var agent = 0; agent < agents.length ;agent++)
        {
            if (agents[agent].idNumber === idNumber)
                return agents[agent]
        }
        return null
    }

    //Partnerships
    getPartnerships()
    {
        return this.get('partnerships');
    }
    addPartnership(partnership)
    {
        var partnerships = this.getPartnerships()
        partnerships.push(partnership)

        //post to server...



    }
    getPartnershipAtIndex(index)
    {
        var partnerships =  this.getPartnerships();
        if (partnerships.length > index)
        {
            return partnerships[index]
        }
        return null
    }
    setPartnershipAtIndex(index, partnership)
    {
        var partnerships =  this.getPartnerships();
        if (partnerships.length > index)
        {
            partnerships[index] = partnership
            this.eventbus.emit(ActionType.UPDATE_PARTNERSHIP);
            this.logger.debug('Updated partnership at index ' + index);

            //post change to server...
        }
        return null
    }
    deletePartnershipAtIndex(index)
    {
        var partnerships = this.getPartnerships();
        if (partnerships.length > index)
        {
            partnerships.splice(index, 1)
            this.eventbus.emit(ActionType.DELETE_PARTNERSHIP);
            this.logger.debug('Delete partnership at index ' + index);

            //post change to server...
        }
    }


    deleteCommissionFile(data)
    {
        var files = this.getCommissionFiles()

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
                this.deleteCommissionFile(data)
                break;

            case ActionType.ADD_AGENT:
                this.addAgent(data.agent)
                break;

            case ActionType.UPDATE_AGENT:
                this.setAgentAtIndex(data.index,data.agent)
                break;

            case ActionType.DELETE_AGENT:
                this.deleteAgentAtIndex(data.index)
                break;

            case ActionType.ADD_PARTNERSHIP:
                this.addPartnership(data.partnership)
                break;

            case ActionType.UPDATE_PARTNERSHIP:
                this.setPartnershipAtIndex(data.index,data.partnership)
                break;

            case ActionType.DELETE_PARTNERSHIP:
                this.deletePartnershipAtIndex(data.index,data.partnership)
                break;


        }
    }
}

var dataStore = new DataStore();
dispatcher.registerStore(dataStore);
export default dataStore;
