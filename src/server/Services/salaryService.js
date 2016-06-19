/**
 * Created by efishtain on 19/05/2016.
 */

var Salary = require('../Models/salary');
var Agent = require('../Models/agent');
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


    function checkAgentIds(salaries) {
        return new Promise(function (resolve, reject) {
            var missingIds = {};
            var mappings = {};
            async.each(salaries,
                function (salary, cb) {
                    Agent.findOne({companyAgentId: salary[1]}).lean().exec(function (err, agent) {
                        if (err) {
                            return reject(err);
                        }
                        if (!agent) {
                            missingIds[salary[1]] = true;
                            return cb();
                        }
                        mappings[salary[1]] = agent;
                        return cb();

                    });
                }, function (err) {
                    if (err) {
                        return reject(err);
                    }
                    //if (Object.keys(missingIds).length > 0) {
                    //    return reject(Object.keys(missingIds));
                    //}
                    return resolve(mappings);
                })
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

    this.processSalaries = function (month, year, companyName,maamRate, salaries, cb) {
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


                        var agentPercentage = mapping[salary[0][1]].salaryPercentage;
                        sum[2] *= agentPercentage[2];
                        sum[2]*=maamRate;
                        sum[3] *= agentPercentage[3];
                        sum[3] *=maamRate;
                        sum[4] *= agentPercentage[4];
                        sum[4] *=maamRate;
                        sum[5] *= agentPercentage[5];
                        sum[5]*=maamRate;
                        salaryTasks.push(addSalaryToAgent.bind(null, agent.agentId, salary[0][1], month, year, sum, companyName));
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