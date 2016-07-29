/**
 * Created by asaf on 25/04/2016.
 */
import Store from '../lib/store.js';
import {ActionType} from '../actions/app-actions.js';
import DataService from '../services/data-service.js';

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

        this.initialize('agents',[]);
        this.initialize('partnerships',[]);
        this.initialize('files', []);

    }

    loadData()
    {
        DataService.loadAgents( (response) => {

            if(response.result == true)
            {
                this.set('agents',response.data,true);
                this.eventbus.emit(ActionType.AGENTS_LOADED);
            }
            else
            {
                this.logger.error("Error while loading agents");
            }
        })

        DataService.loadPartnerships( (response) => {

            if(response.result == true)
            {
                this.set('partnerships',response.data,true);
                this.eventbus.emit(ActionType.PARTNERSHIPS_LOADED);
            }
            else
            {
                this.logger.error("Error while loading partnerships");
            }

        })

        DataService.loadCommissionFiles( (response) => {

            if(response.result == true)
            {
                this.set('files', response.data,true);
                this.eventbus.emit(ActionType.COMMISSION_FILES_LOADED);
            }
            else
            {
                this.logger.error("Error while loading commission files");
            }

        })
    }

    setDummyData() {

        // var file1 = new CommissionFile()
        // file1.company = "כלל"
        // file1.name = "כלל קבצים בעמ.xls";
        // file1.paymentDate = new Date();
        // file1.uploadDate = new Date();
        // file1.note = "אחלה קובץ";
        // file1.taxState = strings.taxIncluded;
        // file1.taxValue = "";
        //
        // var file2 = new CommissionFile()
        // file2.company = "מגדל"
        // file2.name = "מגדל עמלות סוכנים.xls";
        // file2.paymentDate = new Date();
        // file2.uploadDate = new Date();
        // file2.note = "קובץ עם הרבה עמלות";
        // file2.taxState = strings.taxNotIncluded;
        // file2.taxValue = "17";
        //
        // var file3 = new CommissionFile()
        // file3.company = "אלטשולר שחם"
        // file3.name = "אלטשולר-שחם-עמלות-נטו.xls";
        // file3.paymentDate = new Date();
        // file3.uploadDate = new Date();
        // file3.note = "הקובץ מכיל גם מע״מ";
        // file3.taxState = strings.taxNotIncluded;
        // file3.taxValue = "17";
        //
        // var files = [file1,file2,file3]
        // this.initialize('files', files);

        //defaults
        //nifraim - 70(agent) 30(company)
        //heikef - 55(agent) 45(company)
        //bonus - 50(agent) 50(company)
        // var agents = []
        //
        //
        // var karinPayments = []
        // karinPayments.push(new AgentPaymentDetails( {companyName: "מגדל", agentNumber: "2342234523",paymentType: "נפרעים",  agentPart: "55", agencyPart: "45"}  ))
        // karinPayments.push(new AgentPaymentDetails( {companyName: "אלטשולר שחם", agentNumber: "234234",paymentType: "היקף",  agentPart: "55", agencyPart: "45"}  ))
        // karinPayments.push(new AgentPaymentDetails( {companyName: "מנורה", agentNumber: "789565",paymentType: "בונוס",  agentPart: "55", agencyPart: "45"}  ))
        // agents.push(new Agent({
        //     name: "קרין",
        //     familyName: "בוזלי לוי",
        //     idNumber: "112233445",
        //     phoneNumber: "0521510677",
        //     faxNumber: "0521510677",
        //     email: "karin@neto-finance.co.il",
        //     active: true,
        //     paymentsDetails: karinPayments
        // }))
        //
        //
        // var idanPayments = []
        // idanPayments.push(new AgentPaymentDetails( {companyName: "מגדל", agentNumber: "57546",paymentType: "נפרעים",  agentPart: "55", agencyPart: "45"}  ))
        // idanPayments.push(new AgentPaymentDetails( {companyName: "אלטשולר שחם", agentNumber: "231",paymentType: "היקף",  agentPart: "55", agencyPart: "45"}  ))
        // idanPayments.push(new AgentPaymentDetails( {companyName: "כלל", agentNumber: "6865",paymentType: "היקף",  agentPart: "55", agencyPart: "45"}  ))
        // idanPayments.push(new AgentPaymentDetails( {companyName: "מנורה", agentNumber: "9789",paymentType: "בונוס",  agentPart: "55", agencyPart: "45"}  ))
        // agents.push(new Agent({
        //     name: "עידן",
        //     familyName: "כץ",
        //     idNumber: "34421134",
        //     phoneNumber: "0506774836",
        //     faxNumber: "048323746",
        //     email: "idan@neto-finance.co.il",
        //     active: true,
        //     paymentsDetails: idanPayments
        // }))
        //
        // var tomerPayments = []
        // tomerPayments.push(new AgentPaymentDetails( {companyName: "מגדל", agentNumber: "54633",paymentType: "נפרעים",  agentPart: "55", agencyPart: "45"}  ))
        // tomerPayments.push(new AgentPaymentDetails( {companyName: "אלטשולר שחם", agentNumber: "2342",paymentType: "היקף",  agentPart: "55", agencyPart: "45"}  ))
        // tomerPayments.push(new AgentPaymentDetails( {companyName: "מנורה", agentNumber: "678678",paymentType: "בונוס",  agentPart: "55", agencyPart: "45"}  ))
        // agents.push(new Agent({
        //     name: "תומר",
        //     familyName: "כהן",
        //     idNumber: "22343452",
        //     phoneNumber: "0546747636",
        //     faxNumber: "049324232",
        //     email: "tomer@neto-finance.co.il",
        //     active: false,
        //     paymentsDetails: tomerPayments
        // }))
        //
        // agents.push(new Agent({
        //     name: "חומוס",
        //     familyName: "משאושה",
        //     idNumber: "67865443",
        //     phoneNumber: "",
        //     faxNumber: "049324232",
        //     email: "tomer@neto-finance.co.il",
        //     active: false,
        //     paymentsDetails: []
        //
        // }))
        //
        //
        // this.initialize('agents',agents);

        // var partnership1 = new Partnership()
        // partnership1.active = true
        // var partnershipAgentDetails10 = new PartnershipAgentDetails()
        // var partnershipAgentDetails11 = new PartnershipAgentDetails()
        // partnershipAgentDetails10.idNumber = "112233445"
        // partnershipAgentDetails10.part = "64"
        // partnershipAgentDetails11.idNumber = "34421134"
        // partnershipAgentDetails11.part = "36"
        // partnership1.agentsDetails = [partnershipAgentDetails10,partnershipAgentDetails11]
        // partnership1.paymentsDetails.push({companyName: "מגדל", partnershipNumber: "789674",paymentType: "נפרעים",  partnershipPart: "55", agencyPart: "45"})
        // partnership1.paymentsDetails.push({companyName: "כלל", partnershipNumber: "34243254",paymentType: "בונוס",  partnershipPart: "58", agencyPart: "42"})
        // partnership1.paymentsDetails.push({companyName: "מנורה", partnershipNumber: "546786",paymentType: "היקף",  partnershipPart: "45", agencyPart: "65"})
        //
        // var partnership2 = new Partnership()
        // partnership2.active = false
        // var partnershipAgentDetails20 = new PartnershipAgentDetails()
        // var partnershipAgentDetails21 = new PartnershipAgentDetails()
        // partnershipAgentDetails20.idNumber = "67865443"
        // partnershipAgentDetails20.part = "50"
        // partnershipAgentDetails21.idNumber = "34421134"
        // partnershipAgentDetails21.part = "50"
        // partnership2.agentsDetails = [partnershipAgentDetails21,partnershipAgentDetails20]
        // partnership2.paymentsDetails.push({companyName: "מגדל", partnershipNumber: "234234",paymentType: "נפרעים",  partnershipPart: "55", agencyPart: "45"})
        // partnership2.paymentsDetails.push({companyName: "כלל", partnershipNumber: "6786",paymentType: "בונוס",  partnershipPart: "58", agencyPart: "42"})
        // partnership2.paymentsDetails.push({companyName: "מנורה", partnershipNumber: "78977655",paymentType: "היקף",  partnershipPart: "45", agencyPart: "65"})
        // var partnershipsData = [partnership1,partnership2]
        // this.initialize('partnerships',partnershipsData);
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
        DataService.addAgent(agent, (response) => {

            if(response.result == true)
            {
                var agents = this.getAgents()
                agents.push(response.data)
                this.eventbus.emit(ActionType.ADD_AGENT);
            }
            else
            {
                this.logger.error("Error while adding agent");
            }

        })

        // //post to server...
        // $.ajax(
        //     {
        //         url: '/api/v1/agent',
        //         type: 'POST',
        //         data: JSON.stringify(agent),
        //         contentType: 'application/json',
        //         success: function(result)
        //         {
        //             console.log(result);
        //             console.log('addAgent - Server responded with success!');
        //             var agents = this.getAgents()
        //             agents.push(result.agent)
        //             this.eventbus.emit(ActionType.ADD_AGENT);
        //             // if(callback != null)
        //             //     callback('success');
        //         }.bind(this),
        //         error: function(jqXHR, textStatus, errorThrown)
        //         {
        //             console.error('addAgent - ', textStatus, errorThrown.toString());
        //             // if(callback != null)
        //             //     callback('error');
        //         }.bind(this)
        //     });
    }
    deleteAgentAtIndex(index)
    {
        var agent = this.getAgentAtIndex(index)
        if(agent != null)
        {
            //post to server...
            $.ajax(
                {
                    url: '/api/v1/agent/'+agent._id,
                    type: 'DELETE',
                    data: JSON.stringify(agent),
                    contentType: 'application/json',
                    success: function(result)
                    {
                        console.log(result);
                        console.log('deleteAgentAtIndex - Server responded with success!');
                        var agents = this.getAgents()
                        agents.splice(index, 1)
                        this.eventbus.emit(ActionType.DELETE_AGENT);
                        this.logger.debug('Delete agent at index ' + index);
                        // if(callback != null)
                        //     callback('success');
                    }.bind(this),
                    error: function(jqXHR, textStatus, errorThrown)
                    {
                        console.error('deleteAgentAtIndex - ', textStatus, errorThrown.toString());
                        // if(callback != null)
                        //     callback('error');
                    }.bind(this)
                });
        }
    }
    setAgentAtIndex(index, updatedAgent)
    {
        var agent = this.getAgentAtIndex(index)
        if(agent != null)
        {
            $.ajax(
                {
                    url: '/api/v1/agent/'+agent._id,
                    type: 'PUT',
                    data: JSON.stringify(updatedAgent),
                    contentType: 'application/json',
                    success: function (result) {
                        console.log(result);
                        console.log('setAgentAtIndex - Server responded with success!');
                        var agents = this.getAgents()
                        agents[index] = result.agent
                        this.eventbus.emit(ActionType.UPDATE_AGENT);
                        // if(callback != null)
                        //     callback('success');
                    }.bind(this),
                    error: function (jqXHR, textStatus, errorThrown) {
                        console.error('setAgentAtIndex - ', textStatus, errorThrown.toString());
                        // if(callback != null)
                        //     callback('error');
                    }.bind(this)
                });
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
        //post to server...
        $.ajax(
            {
                url: '/api/v1/partnership',
                type: 'POST',
                data: JSON.stringify(partnership),
                contentType: 'application/json',
                success: function(result)
                {
                    console.log(result);
                    console.log('addPartnership - Server responded with success!');
                    var partnerships = this.getPartnerships()
                    partnerships.push(result.partnership)
                    this.eventbus.emit(ActionType.ADD_PARTNERSHIP);
                    // if(callback != null)
                    //     callback('success');
                }.bind(this),
                error: function(jqXHR, textStatus, errorThrown)
                {
                    console.error('addPartnership - ', textStatus, errorThrown.toString());
                    // if(callback != null)
                    //     callback('error');
                }.bind(this)
            });
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
    setPartnershipAtIndex(index, updatedPartnership)
    {
        var partnership = this.getPartnershipAtIndex(index)
        if(partnership != null)
        {
            $.ajax(
                {
                    url: '/api/v1/partnership/'+partnership._id,
                    type: 'PUT',
                    data: JSON.stringify(updatedPartnership),
                    contentType: 'application/json',
                    success: function (result) {
                        console.log(result);
                        console.log('setPartnershipAtIndex - Server responded with success!');
                        var partnerships = this.getPartnerships()
                        partnerships[index] = result.partnership
                        this.eventbus.emit(ActionType.UPDATE_PARTNERSHIP);
                        // if(callback != null)
                        //     callback('success');
                    }.bind(this),
                    error: function (jqXHR, textStatus, errorThrown) {
                        console.error('setPartnershipAtIndex - ', textStatus, errorThrown.toString());
                        // if(callback != null)
                        //     callback('error');
                    }.bind(this)
                });
        }
    }
    deletePartnershipAtIndex(index)
    {
        var partnership = this.getPartnershipAtIndex(index)
        if(partnership != null)
        {
            //post to server...
            $.ajax(
                {
                    url: '/api/v1/partnership/'+partnership._id,
                    type: 'DELETE',
                    data: JSON.stringify(partnership),
                    contentType: 'application/json',
                    success: function(result)
                    {
                        console.log(result);
                        console.log('deletePartnershipAtIndex - Server responded with success!');
                        var partnerships = this.getPartnerships()
                        partnerships.splice(index, 1)
                        this.eventbus.emit(ActionType.DELETE_PARTNERSHIP);
                        this.logger.debug('Delete partnership at index ' + index);
                        // if(callback != null)
                        //     callback('success');
                    }.bind(this),
                    error: function(jqXHR, textStatus, errorThrown)
                    {
                        console.error('deletePartnershipAtIndex - ', textStatus, errorThrown.toString());
                        // if(callback != null)
                        //     callback('error');
                    }.bind(this)
                });
        }
    }


    deleteCommissionFile(data)
    {
        var files = this.getCommissionFiles()

        for(var file = 0; file < files.length; file++)
        {
            if(data.fileName === files[file].name)
            {
                //post to server...
                $.ajax(
                    {
                        url: '/api/v1/file/'+files[file]._id,
                        type: 'DELETE',
                        contentType: 'application/json',
                        success: function(result)
                        {
                            console.log(result);
                            console.log('deleteCommissionFile - Server responded with success!');
                            files.splice(file, 1);
                            data.callback("success")
                            this.logger.debug('delete doc ' + data.name);
                            this.eventbus.emit(ActionType.DELETE_COMMISSION_FILE);

                            // if(callback != null)
                            //     callback('success');
                        }.bind(this),
                        error: function(jqXHR, textStatus, errorThrown)
                        {
                            console.error('deleteCommissionFile - ', textStatus, errorThrown.toString());
                            // if(callback != null)
                            //     callback('error');
                        }.bind(this)
                    });
                break;
            }
        }
    }
    uploadCommissionFile(data)
    {
        var formData = new FormData();
        formData.append('file', data.draggedFile);
        formData.append('data', JSON.stringify(data.commissionFile));

        // now post a new XHR request
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/api/v1/commissions/upload');
        xhr.onload = function ()
        {
            if (xhr.status === 200)
            {
                console.log('all done: ' + xhr.status);
                var file = JSON.parse(xhr.response).file
                var commissionFiles = this.getCommissionFiles()
                commissionFiles.push(file)
                this.eventbus.emit(ActionType.UPLOAD_COMMISSION_FILE);
                if(data.callback != null)
                    data.callback("success")
            }
            else
            {
                console.log(xhr.response);
                if(data.callback != null)
                    data.callback("error")
            }
        }.bind(this);
        xhr.send(formData);
    }

    /* Handle actions */
    onAction(actionType, data)
    {
        this.logger.debug('Received Action ${actionType} with data', data);
        switch (actionType)
        {
            case ActionType.APP_INIT:
                this.loadData()
                break;

            case ActionType.DELETE_COMMISSION_FILE:
                this.deleteCommissionFile(data)
                break;

            case ActionType.UPLOAD_COMMISSION_FILE:
                this.uploadCommissionFile(data)
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
export default dataStore;
