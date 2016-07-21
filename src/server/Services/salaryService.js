/**
 * Created by efishtain on 19/05/2016.
 */

var Salary = require('../Models/salary');
var Agent = require('../Models/agent');
var AgentService = require('./agentsService');
var agentService = new AgentService();
var _ = require('underscore');
var async = require('async');

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

    function addSalaryToAgent(agentId, agentInCompanyId, month, year, salaries, companyName, cb) {
        var salary = new Salary();
        salary.agentId = agentId;
        salary.agentInCompanyId = agentInCompanyId;
        salary.month = month;
        salary.year = year;
        salary.salary = salaries;
        salary.companyName = companyName;
        salary.save(function (err) {
            if (typeof cb === 'function') {
                return cb(null);
            }
        })

    };


    function assignSalariesToAgents(agents, partnerships, salaries, month, year, companyName, maamRate){
        return new Promise(function(resolve, reject){
            var salaryTasks = [];
            salaries = _.groupBy(salaries, function (sal) {
                return sal[1]
            });

            _.each(salaries, function (salary) {
                var agentKey = companyName+'-'+salary[0]
                var agent = mapping[salary[0][1]];
                if (agent) {
                    var sum = {2: 0, 3: 0, 4: 0, 5: 0};
                    _.each(salary, function (s) {
                        if (s[2]) {
                            sum[2] += s[2];
                        }
                        if (s[3]) {
                            sum[3] += s[3];
                        }
                        if (s[4]) {
                            sum[4] += s[4];
                        }
                        if (s[5]) {
                            sum[5] += s[5];
                        }
                    });

                    var firstAgentPercantage = agent.firstAgent.salaryPercentage;
                    if(agent.secondAgent){
                        var secondAgentPercantage = agent.secondAgent.salaryPercentage;
                        var secondSum = _.clone(sum);
                        secondSum[2] *= secondAgentPercantage[2];
                        secondSum[2]*=maamRate;
                        secondSum[3] *= secondAgentPercantage[3];
                        secondSum[3] *=maamRate;
                        secondSum[4] *= secondAgentPercantage[4];
                        secondSum[4] *=maamRate;
                        secondSum[5] *= secondAgentPercantage[5];
                        secondSum[5]*=maamRate;
                        salaryTasks.push(addSalaryToAgent.bind(null, agent.secondAgent.agentId, salary[0][1], month, year, secondSum, companyName));
                    }
                    sum[2] *= firstAgentPercantage[2];
                    sum[2]*=maamRate;
                    sum[3] *= firstAgentPercantage[3];
                    sum[3] *=maamRate;
                    sum[4] *= firstAgentPercantage[4];
                    sum[4] *=maamRate;
                    sum[5] *= firstAgentPercantage[5];
                    sum[5]*=maamRate;
                    salaryTasks.push(addSalaryToAgent.bind(null, agent.firstAgent.agentId, salary[0][1], month, year, sum, companyName));
                }
            });
            async.parallel(salaryTasks, function (err, result) {
                if (err) {
                    return cb(err);
                }
                return cb();
            })

        })
    }

    this.processSalaries = function (month, year, companyName,maamRate, salaries, cb) {
        var agents = {};
        var partnerships = {};
        agentService.getAllAgents()
            .then(function(data){
                _.each(data,function(agent){
                    _.each(agent.paymentsDetails,function(pd){
                        agents[pd.companyName+'-'+pd.agentNumber] = agent;
                    })
                })

            })
            .then(agentService.getAllPartnerships)
            .then(function(data){
                _.each(data,function(partnership){
                    _.each(partnership.paymentsDetails,function(pd){
                        partnerships[pd.companyName+'-'+pd.partnershipNumber] = partnership;
                    })
                })
            })
            .then(checkAgentIds.bind(null,agents,partnerships,companyName, salaries))
            .then(assignSalariesToAgents.bind(null, agents, partnerships, salaries, month, year, companyName, maamRate))
            .then(function(){
                return cb();
            })
            .catch(function(err){
                return cb(err);
            });

        checkAgentIds(salaries).then(function (mapping) {
                salaries = _.groupBy(salaries, function (sal) {
                    return sal[1]
                });
                var salaryTasks = [];
                _.each(salaries, function (salary) {
                    var agent = mapping[salary[0][1]];
                    if (agent) {
                        var sum = {2: 0, 3: 0, 4: 0, 5: 0};
                        _.each(salary, function (s) {
                            if (s[2]) {
                                sum[2] += s[2];
                            }
                            if (s[3]) {
                                sum[3] += s[3];
                            }
                            if (s[4]) {
                                sum[4] += s[4];
                            }
                            if (s[5]) {
                                sum[5] += s[5];
                            }
                        });

                        var firstAgentPercantage = agent.firstAgent.salaryPercentage;
                        if(agent.secondAgent){
                            var secondAgentPercantage = agent.secondAgent.salaryPercentage;
                            var secondSum = _.clone(sum);
                            secondSum[2] *= secondAgentPercantage[2];
                            secondSum[2]*=maamRate;
                            secondSum[3] *= secondAgentPercantage[3];
                            secondSum[3] *=maamRate;
                            secondSum[4] *= secondAgentPercantage[4];
                            secondSum[4] *=maamRate;
                            secondSum[5] *= secondAgentPercantage[5];
                            secondSum[5]*=maamRate;
                            salaryTasks.push(addSalaryToAgent.bind(null, agent.secondAgent.agentId, salary[0][1], month, year, secondSum, companyName));
                        }
                            sum[2] *= firstAgentPercantage[2];
                            sum[2]*=maamRate;
                            sum[3] *= firstAgentPercantage[3];
                            sum[3] *=maamRate;
                            sum[4] *= firstAgentPercantage[4];
                            sum[4] *=maamRate;
                            sum[5] *= firstAgentPercantage[5];
                            sum[5]*=maamRate;
                            salaryTasks.push(addSalaryToAgent.bind(null, agent.firstAgent.agentId, salary[0][1], month, year, sum, companyName));
                    }
                });
                async.parallel(salaryTasks, function (err, result) {
                    if (err) {
                        return cb(err);
                    }
                    return cb();
                })
            })
            .catch(function (err) {
                return cb(err);
            })

    }
}

module.exports = SalaryService;