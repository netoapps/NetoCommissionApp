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
        this.initialize('companies',[]);
        var extendedCommissionType = ["וולתסטון", "ידני"]
        this.initialize('commissionType',[]);
        this.initialize('extendedCommissionType',extendedCommissionType);
        this.initialize('agents',[]);
        this.initialize('partnerships',[]);
        this.initialize('files', []);
    }

    loadData()
    {
        var promise = []
        promise.push(DataService.loadCompanies())
        promise.push(DataService.loadCommissionTypes())
        promise.push(DataService.loadAgents())
        promise.push(DataService.loadPartnerships())
        promise.push(DataService.loadCommissionFiles())
        Promise.all(promise).then((function (values)
        {
            var companies = values[0]
            companies.sort(function (a,b)
            {
                if (a < b)
                    return -1;
                if (a > b)
                    return 1;
                return 0;
            });
            this.set('companies',companies,true);

            this.set('commissionType',values[1],true);

            var agents = values[2]
            agents.sort(function (a,b)
            {
                if (a.name < b.name)
                    return -1;
                if (a.name > b.name)
                    return 1;
                return 0;
            });
            this.set('agents',agents,true)
            this.eventbus.emit(ActionType.AGENTS_LOADED)

            this.set('partnerships',values[3],true)
            this.eventbus.emit(ActionType.PARTNERSHIPS_LOADED)

            this.set('files',values[4],true)
            this.eventbus.emit(ActionType.COMMISSION_FILES_LOADED)

            this.eventbus.emit(ActionType.APP_INIT_COMPLETED)
        }).bind(this)).catch(function (reason)
        {
            console.log("failed to load init data - " + reason)
        })
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
    getExtendedCommissionTypes()
    {
        return this.get('extendedCommissionType');
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
    addAgent(agent,callback)
    {
        DataService.addAgent(agent, (response) => {

            if(response.result == true)
            {
                var agents = this.getAgents()
                agents.push(response.data)
                this.eventbus.emit(ActionType.ADD_AGENT);
                if(callback != null)
                    callback({result:true});
            }
            else
            {
                this.logger.error("Error while adding agent");
                if(callback != null)
                    callback({result:false});
            }

        })
    }
    deleteAgent(idNumber,callback)
    {
        var agent = this.getAgent(idNumber)
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
                        console.log('deleteAgent - Server responded with success!');
                        var agents = this.getAgents()

                        for(var index = 0 ; index < agents.length; index++){
                            if(agents[index].idNumber === idNumber){
                                agents.splice(index,1);
                                break;
                            }
                        }

                        this.eventbus.emit(ActionType.DELETE_AGENT);
                        this.logger.debug('Delete agent with id ' + idNumber);
                        if(callback != null)
                            callback({result:true});
                    }.bind(this),
                    error: function(jqXHR, textStatus, errorThrown)
                    {
                        console.error('deleteAgent - ', textStatus, errorThrown.toString());
                        if(callback != null)
                            callback({result:false});
                    }.bind(this)
                });
        }
    }
    setAgent(idNumber, updatedAgent,callback)
    {
        var agent = this.getAgent(idNumber)
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
                        console.log('setAgent - server responded with success!');
                        var agents = this.getAgents()

                        for(var index = 0 ; index < agents.length; index++){
                            if(agents[index].idNumber === idNumber){
                                agents[index] = result.agent;
                                break;
                            }
                        }

                        this.eventbus.emit(ActionType.UPDATE_AGENT);
                        if(callback != null)
                            callback({result:true});
                    }.bind(this),
                    error: function (jqXHR, textStatus, errorThrown) {
                        console.error('setAgent error - ', textStatus, errorThrown.toString());
                        if(callback != null)
                            callback({result:false});
                    }.bind(this)
                });
        }
    }
    // getAgentAtIndex(index)
    // {
    //     var agents = this.getAgents();
    //     if (agents.length > index)
    //     {
    //         return agents[index]
    //     }
    //     return null
    // }
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
    getPartnership(idNumber)
    {
        var partnerships = this.getPartnerships();
        for (var partnership = 0; partnership < partnerships.length ;partnership++)
        {
            if (partnerships[partnership]._id === idNumber)
                return partnerships[partnership]
        }
        return null
    }
    addPartnership(partnership,callback)
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
                    partnerships.unshift(result.partnership)
                    this.eventbus.emit(ActionType.ADD_PARTNERSHIP);
                    if(callback != null)
                        callback({result:true});
                }.bind(this),
                error: function(jqXHR, textStatus, errorThrown)
                {
                    console.error('addPartnership - ', textStatus, errorThrown.toString());
                    if(callback != null)
                        callback({result:false});
                }.bind(this)
            });
    }
    // getPartnershipAtIndex(index)
    // {
    //     var partnerships =  this.getPartnerships();
    //     if (partnerships.length > index)
    //     {
    //         return partnerships[index]
    //     }
    //     return null
    // }
    setPartnership(partnershipId, updatedPartnership,callback)
    {
        var partnership = this.getPartnership(partnershipId)
        if(partnership != null)
        {
            $.ajax(
                {
                    url: '/api/v1/partnership/'+partnershipId,
                    type: 'PUT',
                    data: JSON.stringify(updatedPartnership),
                    contentType: 'application/json',
                    success: function (result) {
                        console.log(result);
                        console.log('setPartnership - Server responded with success!');

                        var partnerships = this.getPartnerships()
                        for(var index = 0 ; index < partnerships.length; index++){
                            if(partnerships[index]._id === partnershipId)
                            {
                                partnerships[index] = result.partnership;
                                break;
                            }
                        }

                        this.eventbus.emit(ActionType.UPDATE_PARTNERSHIP);
                        if(callback != null)
                            callback({result:true});
                    }.bind(this),
                    error: function (jqXHR, textStatus, errorThrown) {
                        console.error('setPartnership - ', textStatus, errorThrown.toString());
                        if(callback != null)
                            callback({result:false});
                    }.bind(this)
                });
        }
    }
    deletePartnership(partnershipId, callback)
    {
        var partnership = this.getPartnership(partnershipId)
        if(partnership != null)
        {
            //post to server...
            $.ajax(
                {
                    url: '/api/v1/partnership/'+partnershipId,
                    type: 'DELETE',
                    data: JSON.stringify(partnership),
                    contentType: 'application/json',
                    success: function(result)
                    {
                        console.log(result);
                        console.log('deletePartnership - Server responded with success!');

                        var partnerships = this.getPartnerships()
                        for(var index = 0 ; index < partnerships.length; index++){
                            if(partnerships[index]._id === partnershipId){
                                partnerships.splice(index,1);
                                break;
                            }
                        }

                        this.eventbus.emit(ActionType.DELETE_PARTNERSHIP);
                        this.logger.debug('Delete partnership with id ' + partnershipId);
                        if(callback != null)
                            callback({result:true});

                    }.bind(this),
                    error: function(jqXHR, textStatus, errorThrown)
                    {
                        console.error('deletePartnership - ', textStatus, errorThrown.toString());
                        if(callback != null)
                            callback({result:false});
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
                            this.eventbus.emit(ActionType.DELETE_COMMISSION_FILE_COMPLETED);
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
            var response = JSON.parse(xhr.response)
            if (xhr.status === 200)
            {
                console.log('all done: ' + xhr.status);
                var file = response.file
                var commissionFiles = this.getCommissionFiles()
                commissionFiles.push(file)
                this.eventbus.emit(ActionType.UPLOAD_COMMISSION_FILE_COMPLETED);
                if(data.callback != null)
                    data.callback(
                        {
                            result: true,
                            message: ""
                        })
            }
            else
            {
                console.log(xhr.response);
                if(data.callback != null)
                    data.callback({
                        result: false,
                        errCode: response.errCode,
                        errData: response.errData
                    })
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
                setTimeout((function(){ this.loadData() }).bind(this), 900);
                break;

            case ActionType.DELETE_COMMISSION_FILE:
                this.deleteCommissionFile(data)
                break;

            case ActionType.UPLOAD_COMMISSION_FILE:
                this.uploadCommissionFile(data)
                break;

            case ActionType.ADD_AGENT:
                this.addAgent(data.agent,data.callback)
                break;

            case ActionType.UPDATE_AGENT:
                this.setAgent(data.idNumber,data.agent,data.callback)
                break;

            case ActionType.DELETE_AGENT:
                this.deleteAgent(data.idNumber,data.callback)
                break;

            case ActionType.ADD_PARTNERSHIP:
                this.addPartnership(data.partnership,data.callback)
                break;

            case ActionType.UPDATE_PARTNERSHIP:
                this.setPartnership(data.partnershipId,data.partnership,data.callback)
                break;

            case ActionType.DELETE_PARTNERSHIP:
                this.deletePartnership(data.partnershipId,data.callback)
                break;


        }
    }
}

var dataStore = new DataStore();
export default dataStore;
