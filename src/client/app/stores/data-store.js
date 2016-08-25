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
        //2 - portfolio
        //3 - nifraim
        //4 - hekef
        //5 - bonus
        var commissionType = ["היקף","נפרעים","בונוס"]
        var extendedCommissionType = ["ידני"]

        this.initialize('commissionType',commissionType);
        this.initialize('extendedCommissionType',extendedCommissionType);
        this.initialize('agents',[]);
        this.initialize('partnerships',[]);
        this.initialize('files', []);
    }

    loadData()
    {
        DataService.loadAgents( (response) => {

            if(response.result == true)
            {
                var agents = response.data

                agents.sort(function (a,b)
                {
                    if (a.name < b.name)
                        return -1;
                    if (a.name > b.name)
                        return 1;
                    return 0;
                });
                this.set('agents',agents,true);
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
    deleteAgentAtIndex(index,callback)
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
                        if(callback != null)
                            callback({result:true});
                    }.bind(this),
                    error: function(jqXHR, textStatus, errorThrown)
                    {
                        console.error('deleteAgentAtIndex - ', textStatus, errorThrown.toString());
                        if(callback != null)
                            callback({result:false});
                    }.bind(this)
                });
        }
    }
    setAgentAtIndex(index, updatedAgent,callback)
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
                        if(callback != null)
                            callback({result:true});
                    }.bind(this),
                    error: function (jqXHR, textStatus, errorThrown) {
                        console.error('setAgentAtIndex - ', textStatus, errorThrown.toString());
                        if(callback != null)
                            callback({result:false});
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
                    partnerships.push(result.partnership)
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
    getPartnershipAtIndex(index)
    {
        var partnerships =  this.getPartnerships();
        if (partnerships.length > index)
        {
            return partnerships[index]
        }
        return null
    }
    setPartnershipAtIndex(index, updatedPartnership,callback)
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
                        if(callback != null)
                            callback({result:true});
                    }.bind(this),
                    error: function (jqXHR, textStatus, errorThrown) {
                        console.error('setPartnershipAtIndex - ', textStatus, errorThrown.toString());
                        if(callback != null)
                            callback({result:false});
                    }.bind(this)
                });
        }
    }
    deletePartnershipAtIndex(index, callback)
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
                        if(callback != null)
                            callback({result:true});

                    }.bind(this),
                    error: function(jqXHR, textStatus, errorThrown)
                    {
                        console.error('deletePartnershipAtIndex - ', textStatus, errorThrown.toString());
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
                this.loadData()
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
                this.setAgentAtIndex(data.index,data.agent,data.callback)
                break;

            case ActionType.DELETE_AGENT:
                this.deleteAgentAtIndex(data.index,data.callback)
                break;

            case ActionType.ADD_PARTNERSHIP:
                this.addPartnership(data.partnership,data.callback)
                break;

            case ActionType.UPDATE_PARTNERSHIP:
                this.setPartnershipAtIndex(data.index,data.partnership,data.callback)
                break;

            case ActionType.DELETE_PARTNERSHIP:
                this.deletePartnershipAtIndex(data.index,data.callback)
                break;


        }
    }
}

var dataStore = new DataStore();
export default dataStore;
