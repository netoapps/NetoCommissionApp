/**
 * Created by asaf on 29/07/2016.
 */

class DataService {

    //Agents
    getActiveAgentCountForDate(date, callback)
    {
        $.ajax(
            {
                url: '/api/v1/salary/' + date + '/count',
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

    //Commission files
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

    //Salaries
    loadAllCompanyPaymentTypesForMonth(date,callback)
    {
        $.ajax(
            {
                url: '/api/v1/salary/by_company_types_summed/'+date,
                type: 'GET',
                contentType: 'application/json',
                success: function(result)
                {
                    console.log('load commission files entries - server responded with success!');
                    if(callback != null)
                        callback({
                            result:true,
                            data: result.salaries
                        });

                }.bind(this),
                error: function(jqXHR, textStatus, errorThrown)
                {
                    console.error('load all commission files entries - ', textStatus, errorThrown.toString());
                    callback({
                        result:false,
                        data: null
                    });
                }.bind(this)
            });
    }
    loadTotalCommissionAndPortfolioForTypeAndDate(type,date,callback)
    {
        $.ajax(
            {
                url: '/api/v1/salary/'+ date + '/' + type,
                type: 'GET',
                contentType: 'application/json',
                success: function(result)
                {
                    console.log('load commission files entries with type '+type+' - server responded with success!');
                    if(callback != null)
                        callback({
                            result:true,
                            data: result
                        });

                }.bind(this),
                error: function(jqXHR, textStatus, errorThrown)
                {
                    console.error('load commission files entries with type '+type+' - ', textStatus, errorThrown.toString());
                    callback({
                        result:false,
                        data: null
                    });
                }.bind(this)
            });
    }
    loadCommissionFilesEntriesByIdWithTypeAndDate(type,date,callback)
    {
        $.ajax(
            {
                url: '/api/v1/salary/byid/'+ date + '/' + type,
                type: 'GET',
                contentType: 'application/json',
                success: function(result)
                {
                    console.log('load commission files entries with type '+type+' - server responded with success!');
                    if(callback != null)
                        callback({
                            result:true,
                            data: result.salaries
                        });

                }.bind(this),
                error: function(jqXHR, textStatus, errorThrown)
                {
                    console.error('load commission files entries with type '+type+' - ', textStatus, errorThrown.toString());
                    callback({
                        result:false,
                        data: null
                    });
                }.bind(this)
            });
    }
    loadCommissionFilesEntriesWithTypeAndYear(type,year,callback)
    {
        $.ajax(
            {
                url: '/api/v1/salary/bymonths/'+ year + '/' + type,
                type: 'GET',
                contentType: 'application/json',
                success: function(result)
                {
                    console.log('load commission files entries with year '+year+' and type ' + type + ' - server responded with success!');
                    if(callback != null)
                        callback({
                            result:true,
                            data: result.salaries
                        });

                }.bind(this),
                error: function(jqXHR, textStatus, errorThrown)
                {
                    console.error('load commission files entries with year '+year+' and type ' + type + ' - ', textStatus, errorThrown.toString());
                    callback({
                        result:false,
                        data: null
                    });
                }.bind(this)
            });
    }

    loadAgentIncomeData(agentId, date)
    {
        return new Promise(function (resolve, reject)
        {
            $.ajax(
                {
                    url: '/api/v1/agent/'+ agentId + '/salary/by_company_and_types_summed/' + date,
                    type: 'GET',
                    contentType: 'application/json',
                    success: function(result)
                    {
                        console.log('load agent incomes data for date '+ date + ' - server responded with success!');
                        resolve(result.salaries)
                    },
                    error: function(jqXHR, textStatus, errorThrown)
                    {
                        console.error('load agent incomes data for date '+ date + ' - ', textStatus, errorThrown.toString());
                        reject(textStatus); // failure
                    }
                });
        });
    }
    loadAgentIncomeComponentsSumData(agentId, date)
    {
        return new Promise(function (resolve, reject)
        {
            $.ajax(
                {
                    url: '/api/v1/agent/'+ agentId + '/salary/bytypes_summed/' + date,
                    type: 'GET',
                    contentType: 'application/json',
                    success: function(result)
                    {
                        console.log('load agent incomes components sum data for date '+ date + ' - server responded with success!');
                        resolve(result)
                    },
                    error: function(jqXHR, textStatus, errorThrown)
                    {
                        console.error('load agent incomes data for date '+ date + ' - ', textStatus, errorThrown.toString());
                        reject(textStatus); // failure
                    }
                });
        });
    }
    loadAgentPortfolioData(agentId, date)
    {
        return new Promise(function (resolve, reject)
        {
            $.ajax(
                {
                    url: '/api/v1/agent/'+ agentId + '/portfolio/' + date,
                    type: 'GET',
                    contentType: 'application/json',
                    success: function(result)
                    {
                        console.log('load agent portfolio data for date '+ date + ' - server responded with success!');
                        resolve(result.portfolio)
                    }.bind(this),
                    error: function(jqXHR, textStatus, errorThrown)
                    {
                        console.error('load agent portfolio data for date '+ date + ' - ', textStatus, errorThrown.toString());
                        reject(textStatus); // failure

                    }.bind(this)
                });
        });
    }
    loadAgentExpensesData(agentId, date)
    {
        return new Promise(function (resolve, reject)
        {
            $.ajax(
                {
                    url: '/api/v1/agent/'+ agentId + '/expenses/' + date,
                    type: 'GET',
                    contentType: 'application/json',
                    success: function(result)
                    {
                        console.log('load agent expenses data for date '+ date + ' - server responded with success!');
                        resolve(result.expenses)
                    }.bind(this),
                    error: function(jqXHR, textStatus, errorThrown)
                    {
                        console.error('load agent expenses data for date '+ date + ' - ', textStatus, errorThrown.toString());
                        reject(textStatus); // failure

                    }.bind(this)
                });
        });
    }
    addAgentSalaryIncome(income,agentId, callback)
    {
        //post to server...
        $.ajax(
            {
                url: '/api/v1/agent/'+agentId+'/salary',
                type: 'POST',
                data: JSON.stringify(income),
                contentType: 'application/json',
                success: function(result)
                {
                    console.log(result);
                    console.log('addIncome - Server responded with success!');

                    if(callback != null)
                        callback({
                            result:true,
                            data: result.salary
                        });

                }.bind(this),
                error: function(jqXHR, textStatus, errorThrown)
                {
                    console.error('addIncome - ', textStatus, errorThrown.toString());
                    if(callback != null)
                        callback({
                            result:false,
                            data: null
                        });
                }.bind(this)
            });
    }
    updateAgentSalaryIncome(incomeId,income,agentId, callback)
    {
        //post to server...
        $.ajax(
            {
                url: '/api/v1/agent/'+agentId+'/salary/' + incomeId,
                type: 'PUT',
                data: JSON.stringify(income),
                contentType: 'application/json',
                success: function(result)
                {
                    console.log(result);
                    console.log('updateIncome - Server responded with success!');

                    if(callback != null)
                        callback({
                            result:true,
                            data: result.salary
                        });

                }.bind(this),
                error: function(jqXHR, textStatus, errorThrown)
                {
                    console.error('updateIncome - ', textStatus, errorThrown.toString());
                    if(callback != null)
                        callback({
                            result:false,
                            data: null
                        });
                }.bind(this)
            });
    }
    deleteAgentSalaryIncome(incomeId,agentId, callback)
    {
        //post to server...
        $.ajax(
            {
                url: '/api/v1/agent/'+agentId+'/salary/'+incomeId,
                type: 'DELETE',
                contentType: 'application/json',
                success: function(result)
                {
                    console.log(result);
                    console.log('deleteAgentSalaryIncome - Server responded with success!');

                    if(callback != null)
                        callback({
                            result:true,
                            data: null
                        });

                }.bind(this),
                error: function(jqXHR, textStatus, errorThrown)
                {
                    console.error('deleteAgentSalaryIncome - ', textStatus, errorThrown.toString());
                    if(callback != null)
                        callback({
                            result:false,
                            data: null
                        });
                }.bind(this)
            });
    }

    addAgentSalaryExpense(expense,agentId, callback)
    {
        //post to server...
        $.ajax(
            {
                url: '/api/v1/agent/'+agentId+'/expense',
                type: 'POST',
                data: JSON.stringify(expense),
                contentType: 'application/json',
                success: function(result)
                {
                    console.log(result);
                    console.log('addAgentSalaryExpense - Server responded with success!');

                    if(callback != null)
                        callback({
                            result:true,
                            data: result.expense
                        });

                }.bind(this),
                error: function(jqXHR, textStatus, errorThrown)
                {
                    console.error('addAgentSalaryExpense - ', textStatus, errorThrown.toString());
                    if(callback != null)
                        callback({
                            result:false,
                            data: null
                        });
                }.bind(this)
            });
    }
    updateAgentSalaryExpense(expenseId,expense,agentId, callback)
    {
        //post to server...
        $.ajax(
            {
                url: '/api/v1/agent/'+agentId+'/expense/' + expenseId,
                type: 'PUT',
                data: JSON.stringify(expense),
                contentType: 'application/json',
                success: function(result)
                {
                    console.log(result);
                    console.log('updateAgentSalaryExpense - Server responded with success!');

                    if(callback != null)
                        callback({
                            result:true,
                            data: result.expense
                        });

                }.bind(this),
                error: function(jqXHR, textStatus, errorThrown)
                {
                    console.error('updateAgentSalaryExpense - ', textStatus, errorThrown.toString());
                    if(callback != null)
                        callback({
                            result:false,
                            data: null
                        });
                }.bind(this)
            });
    }
    deleteAgentSalaryExpense(expenseId,agentId, callback)
    {
        //post to server...
        $.ajax(
            {
                url: '/api/v1/agent/'+agentId+'/expense/'+expenseId,
                type: 'DELETE',
                contentType: 'application/json',
                success: function(result)
                {
                    console.log(result);
                    console.log('deleteAgentSalaryExpense - Server responded with success!');

                    if(callback != null)
                        callback({
                            result:true,
                            data: null
                        });

                }.bind(this),
                error: function(jqXHR, textStatus, errorThrown)
                {
                    console.error('deleteAgentSalaryExpense - ', textStatus, errorThrown.toString());
                    if(callback != null)
                        callback({
                            result:false,
                            data: null
                        });
                }.bind(this)
            });
    }

}

export default new DataService()
