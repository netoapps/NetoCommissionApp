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


var _ = require('underscore');

function SalaryService() {

    var commissionTypes = [];
    var type3, type4, type5;
    constantService.getCommissionTypes()
        .then(function (ct) {
            commissionTypes = ct;
            type3 = commissionTypes[0];
            type4 = commissionTypes[1];
            type5 = commissionTypes[2];
        });
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////PUBLIC FUNCTIONS/////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    this.addAgentSalary = function (idNumber, agentInCompanyId, paymentDate, amount, type, company, notes) {
        return new Promise(function (resolve, reject) {
            addSalary(idNumber, agentInCompanyId, paymentDate, amount, amount, 0, type, company, 0, null, notes, 'agent',null, function (err, salary) {
                if (err) {
                    return reject(err);
                }
                return resolve(salary);
            })
        })
    }

    this.addPartnershipSalary = function(pid, partnershipIdInCompany, paymentDate, amount, type, company, notes){
        return new Promise(function(resolve, reject){
            Partnership.findById(pid).lean().exec(function(err, partnership){
                if(err){
                    return reject(err);
                }
                if(!partnership){
                    return reject('partnership not found');
                }
                var agentsDetails = partnership.agentsDetails;
                var paymentDetails = partnership.paymentsDetails
                    .filter(function(details){
                        return details.partnershipNumber = partnershipIdInCompany;
                    });
                if(paymentDetails.length!==1){
                    return reject('could not decide on correct partnership id')
                }
                paymentDetails = paymentDetails[0];
                calculatePartnershipSalary(pid, partnershipIdInCompany, agentsDetails, paymentDetails, paymentDate, amount, type, company, 0, null, notes, function(err, salary){
                    if(err){
                        return reject(err);
                    }
                    return resolve(salary);
                })
            })

        })
    };
    this.deletePartnershipSalary = function(id){
        return new Promise(function(resolve, reject){
            Salary.remove({_id:id}, function(err){
                if(err){
                    return reject(err);
                }
                Salary.remove({partnershipSalaryId:id}, function(err){
                    if(err){
                        return reject(err);
                    }
                    return resolve();
                })
            })
        })
    }
    this.getAgentSalariesForDate = function (idNumber, startDate, endDate, cb) {
        Salary.aggregate([
            {$match: {$and: [{paymentDate: {$gte: startDate}}, {paymentDate: {$lte: endDate}}, {agentId: idNumber}, {type: {$ne: 'ידני'}},{owner:'agent'}]}}
        ], function (err, salaries) {
            if (err)return cb(err);
            return cb(null, salaries);
        });
    }
    this.deleteSalary = function (id) {
        return new Promise(function (resolve, reject) {
            Salary.findById(id, function (err, salary) {
                if (err) {
                    return reject(err);
                }
                if (!salary) {
                    return reject({errCode: 22, err: 'salary not found'});
                }
                salary.remove(function (err) {
                    if (err) {
                        return reject(err);
                    }
                    return resolve();
                })
            })
        })
    };
    this.updateSalary = function (id, idNumber, agentInCompanyId, paymentDate, amount, type, company, notes) {
        return new Promise(function (resolve, reject) {
            Salary.findById(id, function (err, salary) {
                if (err) {
                    return reject(err);
                }
                if (!salary) {
                    return reject('salary not found');
                }
                salary.agentInCompanyId = agentInCompanyId;
                salary.idNumber = idNumber;
                salary.paymentDate = paymentDate;
                salary.amount = amount;
                salary.type = type;
                salary.company = company;
                salary.notes = notes;
                salary.updateTime = Date.now();
                salary.save(function (err) {
                    if (err) {
                        return reject({errCode: 500, err: err});
                    }
                    return resolve(salary);
                })
            })
        })
    }
    this.processSalaries = function (paymentDate, company, taxValue, salaries, fileId, cb) {
        var agents = {};
        var partnerships = {};
        var fid = fileId;
        agentService.getAllAgents()
            .then(function (data) {
                _.each(data, function (agent) {
                    _.each(agent.paymentsDetails, function (pd) {
                        agents[pd.companyName + '-' + pd.agentNumber + '-' + pd.paymentType] = {
                            idNumber: agent.idNumber,
                            pd: pd
                        };
                    })
                })

            })
            .then(agentService.getAllPartnerships)
            .then(function (data) {
                _.each(data, function (partnership) {
                    _.each(partnership.paymentsDetails, function (pd) {
                        partnerships[pd.companyName + '-' + pd.partnershipNumber + '-' + pd.paymentType] = {
                            agentsDetails: partnership.agentsDetails,
                            pd: pd,
                            pid:partnership._id
                        };
                    })
                })
            })
            .then(checkAgentIds.bind(null, agents, partnerships, company, salaries))
            .then(assignSalariesToAgents.bind(null, agents, partnerships, salaries, paymentDate, company, taxValue, fid))
            .then(function () {
                return cb();
            })
            .catch(function (err) {
                return cb(err);
            });

    }
    this.getNumberOfPayedSalariesForMonthGroupedById = function (paymentDate) {
        return new Promise(function (resolve, reject) {

            Salary.find({paymentDate: paymentDate.toISOString(),owner:'agent'}).distinct('idNumber').exec(function (err, ids) {
                if (err) {
                    return reject({errCode: 500, err: err});
                }
                return resolve(ids.length);
            });
        })

    }

    this.getAllSalariesSortedByDate = function () {
        return new Promise(function (resolve, reject) {
            Salary.find({type: {$ne: 'ידני'},owner:'agent'}).sort({paymentDate: -1}).exec(function (err, salaries) {
                if (err) {
                    return reject({errCode: 500, err: err});
                }
                return resolve(salaries);
            })
        })

    }
    this.getDateSalariesSummedByType = function (type, pd, owner) {
        return new Promise(function (resolve, reject) {
            var prevMonth = new Date(pd.getTime());
            prevMonth.setMonth(prevMonth.getMonth() - 1);
            Salary.aggregate([
                {$match: {paymentDate: {'$gte': prevMonth, '$lte': pd}, type: type, owner:owner}},
                {$group: {_id: '$paymentDate', amount: {$sum: '$amount'}, portfolio: {$sum: '$portfolio'}}},
                {$sort: {_id: 1}}
            ], function (err, sum) {
                if (err) {
                    return reject({errCode: 500, err: err});
                }
                if (sum.length === 0) {
                    return resolve({currentMonth: {amount: 0, portfolio: 0}, previousMonth: {amount: 0, portfolio: 0}});
                }
                if (sum.length === 1) {
                    if (sum[0]._id.toISOString() === pd.toISOString()) {
                        return resolve({
                            currentMonth: {amount: sum[0].amount, portfolio: sum[0].portfolio},
                            previousMonth: {amount: 0, portfolio: 0}
                        });
                    } else {
                        return resolve({
                            currentMonth: {amount: 0, portfolio: 0},
                            previousMonth: {amount: sum[0].amount, portfolio: sum[0].portfolio}
                        });
                    }
                }
                return resolve({
                    currentMonth: {amount: sum[1].amount, portfolio: sum[1].portfolio},
                    previousMonth: {amount: sum[0].amount, portfolio: sum[0].portfolio}
                });
            })
        })

    }
    this.getAllSalariesForYearByMonths = function (year, type) {
        return new Promise(function (resolve, reject) {
            var fromYear = new Date(year, 0, 1, 0, 0, 0, 0);
            var toYear = new Date(year + 1, 0, 1, 0, 0, 0, 0);
            Salary.aggregate([
                {$match: {paymentDate: {$gte: fromYear, $lt: toYear}, type: type, owner:'agent'}},
                {$group: {_id: {$month: '$paymentDate'}, amount: {$sum: '$amount'}}},
                {$sort: {_id: 1}}
            ], function (err, salaries) {
                if (err) {
                    return reject({errCode: 500, err: err});
                }
                return resolve(salaries);
            })

        })
    }
    this.getAllSalariesForDateAndTypeGroupedById = function (date, type) {
        return new Promise(function (resolve, reject) {
            date = new Date(date);
            var prevDate = new Date(date.getTime());
            prevDate.setMonth(prevDate.getMonth() - 1);
            Salary.aggregate([
                {$match: {paymentDate: {'$gte': prevDate, '$lte': date}, type: type, owner:'agent'}},
                {$sort: {paymentDate: 1}},
                {
                    $group: {
                        _id: {idNumber: '$idNumber', date: '$paymentDate'},
                        amount: {$sum: '$amount'},
                        portfolio: {$sum: '$portfolio'}
                    }
                }
            ], function (err, salaries) {
                if (err) {
                    return reject(err);
                }

                salaries = _.groupBy(salaries, function (sal) {
                    return sal._id.idNumber
                });
                salaries = _.map(salaries, function (sal, id) {
                    if (sal.length === 0) {
                        return [id, {
                            currentMonth: {
                                amount: 0, portfolio: 0
                            }, previousMonth: {
                                amount: 0, portfolio: 0
                            }
                        }]
                    } else if (sal.length === 1) {
                        if (sal[0]._id.date.toISOString() == date.toISOString()) {
                            return [id, {
                                currentMonth: {amount: sal[0].amount, portfolio: sal[0].portfolio},
                                previousMonth: {amount: 0, portfolio: 0}
                            }]
                        } else {
                            return [id, {
                                currentMonth: {amount: 0, portfolio: 0},
                                previousMonth: {amount: sal[0].amount, portfolio: sal[0].portfolio}
                            }]
                        }
                    } else {

                        return [id, {
                            currentMonth: {amount: sal[0].amount, portfolio: sal[0].portfolio},
                            previousMonth: {amount: sal[1].amount, portfolio: sal[1].portfolio}
                        }]

                    }

                })
                salaries = _.reduce(salaries, function (memo, sal) {
                    memo[sal[0]] = sal[1];
                    return memo;
                }, {});


                return resolve(salaries);
            })

        })
    }
    this.removeSalariesByFileId = function (fileId) {
        return new Promise(function (resolve, reject) {
            Salary.remove({fileId: fileId}, function (err) {
                if (err) {
                    return reject({errCode: 500, err: err});
                }
                return resolve();
            })
        })

    }
    this.getAgentPortfolioForDate = function (idNumber, date, owner) {
        return new Promise(function (resolve, reject) {
            date = new Date(date);
            Salary.aggregate([
                {$match: {idNumber: idNumber, type: 'נפרעים', paymentDate: date, owner:owner}},
                {$group: {_id: null, portfolio: {$sum: '$portfolio'}}}
            ], function (err, data) {
                if (err) {
                    return reject({errCode: 500, err: err});
                }
                if (data.length === 0) {
                    return resolve(0);
                }
                return resolve(data[0].portfolio);
            })
        })
    }
    this.getAllIdSalariesByTypesForDateSummed = function (idNumber, date, owner) {
        return new Promise(function (resolve, reject) {
            date = new Date(date);
            Salary.aggregate([
                {$match: {idNumber: idNumber, paymentDate: date, owner:owner}},
                {
                    $group: {
                        _id: null,
                        'נפרעים': {$sum: {$cond: [{$eq: ['$type', 'נפרעים']}, '$calculatedAmount', 0]}},
                        'בונוס': {$sum: {$cond: [{$eq: ['$type', 'בונוס']}, '$calculatedAmount', 0]}},
                        'היקף': {$sum: {$cond: [{$eq: ['$type', 'היקף']}, '$calculatedAmount', 0]}},
                        'ידני': {$sum: {$cond: [{$eq: ['$type', 'ידני']}, '$calculatedAmount', 0]}}
                    }
                }
            ], function (err, data) {
                if (err) {
                    return reject(err);
                }
                if (data.length === 0) {
                    return resolve({'נפרעים': 0, 'בונוס': 0, 'היקף': 0, 'ידני': 0});
                }
                return resolve({
                    'נפרעים': data[0]['נפרעים'],
                    'בונוס': data[0]['בונוס'],
                    'היקף': data[0]['היקף'],
                    'ידני': data[0]['ידני']
                });
            })
        })
    }
    this.getAllAgentsSalariesByCompanyAndTypesForDateSummed = function (date) {
        return new Promise(function (resolve, reject) {
            date = new Date(date);
            Salary.find({paymentDate: date, partnershipSalaryId:null}).lean().exec(function (err, data) {
                data = _.groupBy(data, function (sal) {
                    return sal.company + '#' + sal.agentInCompanyId + '#' + sal.type + '#' + sal.idNumber;
                })
                data = _.map(data, function (sals, key) {
                    var sum = _.reduce(sals, function (accum, sal) {
                        accum.portfolio += sal.portfolio;
                        accum.amount += sal.amount;
                        return accum;
                    }, {portfolio: 0, amount: 0});

                    return {
                        agentInCompanyId: sals[0].agentInCompanyId,
                        amount: sum.amount,
                        portfolio: sum.portfolio,
                        creationTime: sals[0].creationTime,
                        fileId: sals[0].fileId,
                        idNumber: sals[0].idNumber,
                        notes: sals[0].notes,
                        type: sals[0].type,
                        updateTime: sals[0].updateTime,
                        company: sals[0].company,
                        paymentDate: sals[0].paymentDate,
                        owner:sals[0].owner,
                        partnershipSalaryId:sals[0].partnershipSalaryId
                    }
                })

                return resolve(data);
            })
        })
    }
    this.getSalariesByCompanyAndTypesForDateSummed = function (id, date, owner) {
        return new Promise(function (resolve, reject) {
            date = new Date(date);
            Salary.find({paymentDate: date, idNumber: id, owner:owner, fileId:{'$ne':null}}).lean().exec(function (err, data) {
                data = _.groupBy(data, function (sal) {
                    return sal.company + '#' + sal.agentInCompanyId + '#' + sal.type + '#' + sal.idNumber;
                })

                data = _.map(data, function (sals, key) {
                    var sum = _.reduce(sals, function (accum, sal) {
                        accum.portfolio += sal.portfolio;
                        accum.amount += sal.amount;
                        accum.calculatedAmount += sal.calculatedAmount;
                        accum.agencyAmount += sal.agencyAmount;
                        return accum;
                    }, {portfolio: 0, amount: 0, calculatedAmount: 0, agencyAmount: 0});

                    return {
                        agentInCompanyId: sals[0].agentInCompanyId,
                        amount: sum.amount,
                        calculatedAmount: sum.calculatedAmount,
                        agencyAmount: sum.agencyAmount,
                        portfolio: sum.portfolio,
                        creationTime: sals[0].creationTime,
                        fileId: sals[0].fileId,
                        idNumber: sals[0].idNumber,
                        notes: sals[0].notes,
                        type: sals[0].type,
                        updateTime: sals[0].updateTime,
                        company: sals[0].company,
                        paymentDate: sals[0].paymentDate,
                        owner:sals[0].owner,
                        partnershipSalaryId:sals[0].partnershipSalaryId
                    }
                })

                return resolve(data);
            })
        })
    }


    this.getSalariesByCompanyAndTypesForDateSummedManual = function (id, date, owner) {
        return new Promise(function (resolve, reject) {
            date = new Date(date);
            Salary.find({paymentDate: date, idNumber: id, owner:owner, fileId:null}).lean().exec(function (err, data) {
                if(err){
                    return reject(err);
                }
                return resolve(data);
            })
        })
    }


    this.getAllAgentSalariesByTypesForDate = function (idNumber, date) {
        return new Promise(function (resolve, reject) {
            date = new Date(date);

            Salary.find({idNumber: idNumber, paymentDate: date, owner:'agent'}).lean().exec(function (err, salaries) {
                if (err) {
                    return reject(err);
                }
                if (salaries.length === 0) {
                    return resolve({'נפרעים': [], 'בונוס': [], 'היקף': [], 'ידני': []});
                }

                salaries = _.groupBy(salaries, function (sal) {
                    return sal.type;
                });

                return resolve({
                    'נפרעים': salaries['נפרעים'] || [],
                    'בונוס': salaries['בונוס'] || [],
                    'היקף': salaries['היקף'] || [],
                    'ידני': salaries['ידני'] || []
                });
            })
        });
    }

    function checkAgentIds(agentsMaps, partnershipsMaps, companyName, salaries) {
        return new Promise(function (resolve, reject) {
            var missingIds = {};
            _.each(salaries, function (salary) {
                var agentNumber = companyName + '-' + salary['מספר סוכן'];
                if (!agentsMaps[agentNumber + '-' + type3] && !partnershipsMaps[agentNumber + '-' + type3] && !agentsMaps[agentNumber + '-' + type4] && !partnershipsMaps[agentNumber + '-' + type4] && !agentsMaps[agentNumber + '-' + type5] && !partnershipsMaps[agentNumber + '-' + type5]) {
                    missingIds[salary['מספר סוכן']] = true;
                }
            });
            if (Object.keys(missingIds).length > 0) {
                return reject({errCode: 34, err: 'missing agent ids', errData: Object.keys(missingIds)});
            }
            return resolve();
        });
    }
    function addSalary(idNumber, agentInCompanyId, paymentDate, amount, caclulatedAmount, agencyAmount, type, company, portfolio, fileId, notes, owner, partnershipSalaryId, cb) {
        var salary = new Salary();
        salary.idNumber = idNumber;
        salary.agentInCompanyId = agentInCompanyId;
        salary.paymentDate = paymentDate;
        salary.amount = amount;
        salary.calculatedAmount = caclulatedAmount;
        salary.type = type;
        salary.company = company;
        salary.portfolio = portfolio;
        salary.fileId = fileId;
        salary.notes = notes || '';
        salary.agencyAmount = agencyAmount;
        salary.owner = owner;
        salary.partnershipSalaryId = partnershipSalaryId;
        salary.save(function (err) {
            if (typeof cb === 'function') {
                return cb(null, salary);
            }
        })

    };
    function calculatePartnershipSalary(pid, partnershipIdInCompany, agentsDetails, paymentDetails, paymentDate, amount, type, company, portfolio, fileId, notes, cb) {
        var agentsPart = amount * Number(paymentDetails.partnershipPart) / 100;
        var agencyPart = amount * Number(paymentDetails.agencyPart) / 100;
        //this will add the salary to the partnership
        addSalary(pid, partnershipIdInCompany, paymentDate, amount, agentsPart, agencyPart, type, company, portfolio, fileId, notes, 'partnership',null, function (err, pSalary) {
            if (err) {
                return cb(err);
            }
            var pSalId = pSalary._id;
            var agentsSalaryTasks = [];
            _.each(agentsDetails, function (agent) {
                var calculatedAmount = agentsPart;
                calculatedAmount *= Number(agent.part) / 100;
                var agencyAmount = agencyPart;
                agencyAmount *= Number(agent.part) / 100;
                agentsSalaryTasks.push(addSalary.bind(null, agent.idNumber, partnershipIdInCompany, paymentDate, amount, calculatedAmount, agencyAmount, type, company, portfolio, fileId, '','agent', pSalId));
            });
            async.parallel(agentsSalaryTasks, function(err, result){
                if(err){
                    return cb(err);
                }
                return cb();
            })
        });
    }

    function assignSalariesToAgents(agents, partnerships, salaries, paymentDate, company, taxValue, fileId) {
        return new Promise(function (resolve, reject) {
            var salaryTasks = [];
            salaries.map(function (s) {
                if (s[type3]) {
                    s[type3] *= taxValue;
                }
                if (s[type4]) {
                    s[type4] *= taxValue;
                }
                if (s[type5]) {
                    s[type5] *= taxValue;
                }
            });


            _.each(salaries, function (salary) {
                var salaryIdType3 = company + '-' + salary['מספר סוכן'] + '-' + type3;
                var salaryIdType4 = company + '-' + salary['מספר סוכן'] + '-' + type4;
                var salaryIdType5 = company + '-' + salary['מספר סוכן'] + '-' + type5;
                var agentPaymentDetails, pd, amount = 0, calculatedAmount = 0, agencyAmount = 0,partnershipId=null, partnershipPaymentDetails;
                var agentsDetails = [];
                if (agents[salaryIdType3] && salary[type3]) {
                    agentPaymentDetails = agents[salaryIdType3];
                    pd = agentPaymentDetails.pd;
                    amount = Number(salary[type3]);
                    calculatedAmount = amount;
                    calculatedAmount *= Number(pd.agentPart) / 100;
                    agencyAmount = amount;
                    agencyAmount *= Number(pd.agencyPart) / 100;
                    salaryTasks.push(addSalary.bind(null, agentPaymentDetails.idNumber, salary['מספר סוכן'], paymentDate, amount, calculatedAmount, agencyAmount, type3, company, salary['גודל תיק'], fileId, '', 'agent', null));
                }
                if (agents[salaryIdType4] && salary[type4]) {
                    agentPaymentDetails = agents[salaryIdType4];
                    pd = agentPaymentDetails.pd;
                    amount = Number(salary[type4]);
                    calculatedAmount = amount;
                    calculatedAmount *= Number(pd.agentPart) / 100;
                    agencyAmount = amount;
                    agencyAmount *= Number(pd.agencyPart) / 100;
                    salaryTasks.push(addSalary.bind(null, agentPaymentDetails.idNumber, salary['מספר סוכן'], paymentDate, amount, calculatedAmount, agencyAmount, type4, company, 0, fileId, '', 'agent',null));
                }
                if (agents[salaryIdType5] && salary[type5]) {
                    agentPaymentDetails = agents[salaryIdType5];
                    pd = agentPaymentDetails.pd;
                    amount = Number(salary[type5]);
                    calculatedAmount = amount;
                    calculatedAmount *= Number(pd.agentPart) / 100;
                    agencyAmount = amount;
                    agencyAmount *= Number(pd.agencyPart) / 100;
                    salaryTasks.push(addSalary.bind(null, agentPaymentDetails.idNumber, salary['מספר סוכן'], paymentDate, amount, calculatedAmount, agencyAmount, type5, company, 0, fileId, '', 'agent',null));
                }


                if (partnerships[salaryIdType3] && salary[type3]) {
                    partnershipId = partnerships[salaryIdType3].pid;
                    partnershipPaymentDetails = partnerships[salaryIdType3];
                    agentsDetails = partnershipPaymentDetails.agentsDetails;
                    pd = partnershipPaymentDetails.pd;
                    amount = Number(salary[type3]);
                    salaryTasks.push(calculatePartnershipSalary.bind(null,partnershipId, salary['מספר סוכן'], agentsDetails, pd, paymentDate, amount, type3, company, salary['גודל תיק'], fileId,''));
                }
                if (partnerships[salaryIdType4] && salary[type4]) {
                    partnershipId = partnerships[salaryIdType4].pid;
                    partnershipPaymentDetails = partnerships[salaryIdType4];
                    agentsDetails = partnershipPaymentDetails.agentsDetails;
                    pd = partnershipPaymentDetails.pd;
                    amount = Number(salary[type4]);
                    salaryTasks.push(calculatePartnershipSalary.bind(null,partnershipId, salary['מספר סוכן'], agentsDetails, pd, paymentDate, amount, type4, company, 0, fileId,''));
                }
                if (partnerships[salaryIdType5] && salary[type5]) {
                    partnershipId = partnerships[salaryIdType5].pid;
                    partnershipPaymentDetails = partnerships[salaryIdType5];
                    agentsDetails = partnershipPaymentDetails.agentsDetails;

                    pd = partnershipPaymentDetails.pd;
                    amount = Number(salary[type5]);
                    salaryTasks.push(calculatePartnershipSalary.bind(null,partnershipId, salary['מספר סוכן'], agentsDetails, pd, paymentDate, amount, type5, company, 0, fileId,''));
                }
            });

            async.parallel(salaryTasks, function (err, result) {
                if (err) {
                    return reject(err);
                }
                return resolve();
            })

        })
    }


}

module.exports = SalaryService;