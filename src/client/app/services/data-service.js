/**
 * Created by asaf on 29/07/2016.
 */

class DataService {

    //Agents
    getActiveAgentCountForDate(date, callback)
    {
        //post to server...
        $.ajax(
            {
                url: '/api/v1/salary/' + date,
                type: 'GET',
                contentType: 'application/json',
                success: function(result)
                {
                    console.log(result);
                    console.log('getActiveAgentCountForDate - Server responded with success!');

                    if(callback != null)
                        callback({
                            result:true,
                            data: result.count
                        });

                }.bind(this),
                error: function(jqXHR, textStatus, errorThrown)
                {
                    console.error('getActiveAgentCountForDate - ', textStatus, errorThrown.toString());
                    if(callback != null)
                        callback({
                            result:false,
                            data: null
                        });
                }.bind(this)
            });
    }
    addAgent(agent, callback)
    {
        //post to server...
        $.ajax(
            {
                url: '/api/v1/agent',
                type: 'POST',
                data: JSON.stringify(agent),
                contentType: 'application/json',
                success: function(result)
                {
                    console.log(result);
                    console.log('addAgent - Server responded with success!');

                    if(callback != null)
                        callback({
                            result:true,
                            data: result.agent
                        });

                }.bind(this),
                error: function(jqXHR, textStatus, errorThrown)
                {
                    console.error('addAgent - ', textStatus, errorThrown.toString());
                    if(callback != null)
                        callback({
                            result:false,
                            data: null
                        });
                }.bind(this)
            });
    }
    loadAgents(callback)
    {
        $.ajax(
            {
                url: '/api/v1/agent',
                type: 'GET',
                contentType: 'application/json',
                success: function(result)
                {
                    console.log('load agents - server responded with success!');
                     if(callback != null)
                         callback({
                             result:true,
                             data: result.agents
                         });
                }.bind(this),
                error: function(jqXHR, textStatus, errorThrown)
                {
                    console.error('load agents - ', textStatus, errorThrown.toString());
                    if(callback != null)
                        callback({
                            result:false,
                            data: null
                        });
                }.bind(this)
            });
    }

    loadPartnerships(callback)
    {
        $.ajax(
            {
                url: '/api/v1/partnership',
                type: 'GET',
                contentType: 'application/json',
                success: function(result)
                {
                    console.log('load partnerships - server responded with success!');
                    if(callback != null)
                        callback({
                            result:true,
                            data: result.partnerships
                        });

                }.bind(this),
                error: function(jqXHR, textStatus, errorThrown)
                {
                    console.error('load partnerships - ', textStatus, errorThrown.toString());
                    callback({
                        result:false,
                        data: null
                    });
                }.bind(this)
            });
    }

    loadCommissionFiles(callback)
    {
        $.ajax(
            {
                url: '/api/v1/file',
                type: 'GET',
                contentType: 'application/json',
                success: function(result)
                {
                    console.log('load commission files - server responded with success!');
                    if(callback != null)
                        callback({
                            result:true,
                            data: result.files
                        });

                }.bind(this),
                error: function(jqXHR, textStatus, errorThrown)
                {
                    console.error('load commission files - ', textStatus, errorThrown.toString());
                    callback({
                        result:false,
                        data: null
                    });
                }.bind(this)
            });
    }
}

export default new DataService()
