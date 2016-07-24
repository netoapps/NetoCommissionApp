/**
 * Created by efishtain on 19/05/2016.
 */

var Salary = require('../Models/salary');
var Agent = require('../Models/agent');
var AgentService = require('./agentsService');
var agentService = new AgentService();
var _ = require('underscore');
var async = require('async');
var ConstantService = require('./constantService');
var constantService = new ConstantService();
const commisionTypes = constantService.getCommisionTypes();
const type3 = commisionTypes[0];
const type4 = commisionTypes[1];
const type5 = commisionTypes[2];

function SalaryService() {

    this.getAllAgentSalaries = function (agentId, cb) {
        Salary.find({agentId: agentId}, function (err, salaries) {
            if (err) {
                return cb(err);
            }
            return cb(null, salaries);
        })
    };
    this.getAgentSalariesForMonthsAndYear = function (agentId, startMonth, endMonth, startYear, endYear, cb) {
        Salary.aggregate([
            {$match: {$and: [{month: {$gte: startMonth}}, {year: {$gte: startYear}}, {month: {$lte: endMonth}}, {year: {$lte: endYear}}, {agentId: agentId}]}}
        ], function (err, salaries) {
            if (err)return cb(err);
            return cb(null, salaries);
        });
    }
    this.getAgentSalariesByMonthYearAndType = function (agentId, month, year, cb) {
        Salary.aggregate([
            {$match: {$and: [{month: month}, {year: year}, {agentId: agentId}]}},
            {
                $group: {
                    _id: '$agentId',
                    2: {$sum: '$salary.2'},
                    3: {$sum: '$salary.3'},
                    4: {$sum: '$salary.4'},
                    5: {$sum: '$salary.5'}
                }
            }
        ], function (err, salaries) {
            if (err)return cb(err);
            return cb(null, salaries);
        })
    }
    this.deleteSalariesByMonthAndYear = function(month, year){

    }
    this.deleteSalary = function (agentIds) {

    };

    this.deleteAgentSalaries = function () {

    };


    function checkAgentIds(agentsMaps, partnershipsMaps, companyName, salaries) {
        return new Promise(function (resolve, reject) {
            var missingIds = {};
            _.each(salaries,function(salary){
                var agentNumber = companyName+'-'+salary[1];
                if(!agentsMaps[agentNumber] && !partnershipsMaps[agentNumber]){
                    missingIds[salary[1]]=true;
                }
            });
            if (Object.keys(missingIds).length > 0) {
                return reject(Object.keys(missingIds));
            }
            return resolve();
        });
    }

    function addSalaryToAgent(idNumber, agentInCompanyId, paymentDate, amount, type, company, cb) {
        var salary = new Salary();
        salary.idNumber = idNumber;
        salary.agentInCompanyId = agentInCompanyId;
        salary.paymentDate =paymentDate;
        salary.amount = amount;
        salary.type = type;
        salary.company = company;
        salary.save(function (err) {
            if (typeof cb === 'function') {
                return cb(null);
            }
        })

    };

    //Multiply all salarie by tax value
    //for id:
    //  find the id in agents/partnerships
    //  for each salary of current id
    //      create a new salary in db for company, curr
    function assignSalariesToAgents(agents, partnerships, salaries, paymentDate, company, taxValue){
        return new Promise(function(resolve, reject){
            var salaryTasks = [];
            salaries.map(function(s){
                if(s[3]){
                    s[3]*=taxValue;
                }
                if(s[4]){
                    s[4]*=taxValue;
                }
                if(s[5]){
                    s[5]*=taxValue;
                }
            });


            _.each(salaries, function(salary){
                var salaryIdType3 = company+'-'+salary[1] +'-'+type3;
                var salaryIdType4 = company+'-'+salary[1] +'-'+type4;
                var salaryIdType5 = company+'-'+salary[1] +'-'+type5;
                var agentPaymentDetails, pd, amount= 0, partnershipPaymentDetails;
                var agentsDetails = [];
                if(agents[salaryIdType3] && salary[3]){
                    agentPaymentDetails = agents[salaryIdType3];
                    pd = agentPaymentDetails.pd;
                    amount = Number(salary[3]);
                    amount*=Number(pd.agentPart)/100;
                    salaryTasks.push(addSalaryToAgent.bind(null,agentPaymentDetails.idNumber,salary[1], paymentDate, amount,3,company));
                }else if(agents[salaryIdType4] && salary[4]){
                    agentPaymentDetails = agents[salaryIdType4];
                    pd = agentPaymentDetails.pd;
                    amount = Number(salary[4]);
                    amount*=Number(pd.agentPart)/100;
                    salaryTasks.push(addSalaryToAgent.bind(null,agentPaymentDetails.idNumber,salary[1], paymentDate,amount,4,company));
                }else if(agents[salaryIdType5] && salary[5]){
                    agentPaymentDetails = agents[salaryIdType5];
                    pd = agentPaymentDetails.pd;
                    amount = Number(salary[5]);
                    amount*=Number(pd.agentPart)/100;
                    salaryTasks.push(addSalaryToAgent.bind(null,agentPaymentDetails.idNumber,salary[1], paymentDate, amount,5,company));
                }else if(partnerships[salaryIdType3] && salary[3]){
                    partnershipPaymentDetails = partnerships[salaryIdType3];
                    agentsDetails = partnershipPaymentDetails.agentsDetails;
                    pd = partnershipPaymentDetails.pd;
                    _.each(agentsDetails, function(agent){
                        amount = Number(salary[3]);
                        amount*=Number(agent.part)/100;
                        amount*=Number(pd.partnershipPart)/100;
                        salaryTasks.push(addSalaryToAgent.bind(null,agent.idNumber,salary[1], paymentDate, amount,3,company));
                    })
                }else if(partnerships[salaryIdType4] && salary[4]){
                    partnershipPaymentDetails = partnerships[salaryIdType4];
                    agentsDetails = partnershipPaymentDetails.agentsDetails;
                    pd = partnershipPaymentDetails.pd;
                    _.each(agentsDetails, function(agent){
                        amount = Number(salary[4]);
                        amount*=Number(agent.part)/100;
                        amount*=Number(pd.partnershipPart)/100;
                        salaryTasks.push(addSalaryToAgent.bind(null,agent.idNumber,salary[1], paymentDate, amount,4,company));
                    })
                }
                else if(partnerships[salaryIdType4] && salary[5]){
                    partnershipPaymentDetails = partnerships[salaryIdType5];
                    agentsDetails = partnershipPaymentDetails.agentsDetails;
                    pd = partnershipPaymentDetails.pd;
                    _.each(agentsDetails, function(agent){
                        amount = Number(salary[5]);
                        amount*=Number(agent.part)/100;
                        amount*=Number(pd.partnershipPart)/100;
                        salaryTasks.push(addSalaryToAgent.bind(null,agent.idNumber,salary[1], paymentDate, amount,5,company));
                    })
                }else {}
            });

            async.parallel(salaryTasks, function (err, result) {
                if (err) {
                    return reject(err);
                }
                return resolve();
            })

        })
    }

    this.processSalaries = function (paymentDate, company,taxValue, salaries, cb) {
        var agents = {};
        var partnerships = {};
        agentService.getAllAgents()
            .then(function(data){
                _.each(data,function(agent){
                    _.each(agent.paymentsDetails,function(pd){
                        agents[pd.companyName+'-'+pd.agentNumber+'-'+pd.paymentType] = {idNumber:agent.idNumber, pd:pd};
                    })
                })

            })
            .then(agentService.getAllPartnerships)
            .then(function(data){
                _.each(data,function(partnership){
                    _.each(partnership.paymentsDetails,function(pd){
                        partnerships[pd.companyName+'-'+pd.partnershipNumber+'-'+pd.paymentType] = {agentsDetails:partnership.agentsDetails,pd:pd };
                    })
                })
            })
            .then(checkAgentIds.bind(null,agents,partnerships,company, salaries))
            .then(assignSalariesToAgents.bind(null, agents, partnerships, salaries,paymentDate, company, taxValue))
            .then(function(){
                return cb();
            })
            .catch(function(err){
                return cb(err);
            });

    }
}

module.exports = SalaryService;