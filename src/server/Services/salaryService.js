/**
 * Created by efishtain on 19/05/2016.
 */

var Salary = require('../Models/salary');
var Agent = require('../Models/agent');
var Partnership = require('../Models/partnership');
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
    this.addAgentSalary = function (idNumber, agentInCompanyId, paymentDate, amount, calculatedSalary, type, company, notes) {
        return new Promise(function (resolve, reject) {
            addSalary(idNumber, agentInCompanyId, paymentDate, amount, calculatedSalary, 0, type, company, 0, null, notes, 'agent',null, function (err, salary) {
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
                //var paymentDetails = partnership.paymentsDetails
                //    .filter(function(details){
                //        return details.partnershipNumber = partnershipIdInCompany;
                //    });
                //if(paymentDetails.length!==1){
                //    return reject('could not decide on correct partnership id')
                //}

                //for manual partnership salary, payment details are always 100% for the partnership
                var paymentDetails = {};
                paymentDetails.partnershipPart=100;
                paymentDetails.agencyPart=0;
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
    this.updateSalary = function (id, idNumber, agentInCompanyId, paymentDate, amount, calculatedAmount, type, company, notes) {
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
                salary.calculatedAmount = calculatedAmount;
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
            .then(constantService.getCompanyIdByName.bind(null,company))
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
            var sumQuery = {};
            commissionTypes.filter(function(type){
                return type !=='ידני'
            }).map(function(type){
                sumQuery[type] = {$sum: {$cond: [{$eq: ['$type', type]}, '$calculatedAmount', 0]}}
            });
            sumQuery['ידני'] = {$sum: {$cond: [{$and:[{$eq: ['$fileId', null]},{$eq:['$type','ידני']}]}, '$calculatedAmount', 0]}};
            sumQuery['_id']=null;
            Salary.aggregate([
                {$match: {idNumber: idNumber, paymentDate: date, owner:owner}},
                {
                    $group: sumQuery
                }
            ], function (err, data) {
                if (err) {
                    return reject(err);
                }
                var sums = {};
                commissionTypes.forEach(function(type){
                    if(data.length===0){
                        sums[type]=0;
                    }else{
                        sums[type]=data[0][type];
                    }
                })
                sums['ידני'] = data.length>0?data[0]['ידני']:0;
                return resolve(sums);
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

                var salsObj = {};
                commissionTypes.forEach(function(type){
                    salsObj[type] = salaries[type] || []
                })
                commissionTypes['ידני'] = salaries['ידני'] || [];
                return resolve(salsObj);
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
                agentsSalaryTasks.push(addSalary.bind(null, agent.idNumber, partnershipIdInCompany, paymentDate, amount, calculatedAmount, agencyAmount, type, company, portfolio*Number(agent.part) / 100, fileId, '','agent', pSalId));
            });
            async.parallel(agentsSalaryTasks, function(err, result){
                if(err){
                    return cb(err);
                }
                return cb(null,pSalary);
            })
        });
    }

    function assignSalariesToAgents(agents, partnerships, salaries, paymentDate, company, taxValue, fileId) {
        return new Promise(function (resolve, reject) {
            var salaryTasks = [];
            salaries.map(function (s) {
                commissionTypes.forEach(function(type){
                    if (s[type]) {
                        s[type] *= taxValue;
                    }
                })
            });


            _.each(salaries, function (salary) {
                commissionTypes.forEach(function(type){
                    var salaryIdType = company + '-' + salary['מספר סוכן'] + '-' + type;
                    var agentPaymentDetails, pd, amount = 0, calculatedAmount = 0, agencyAmount = 0,partnershipId=null, partnershipPaymentDetails;
                    var agentsDetails = [];
                    var portfolio = 0;
                    if(type==='נפרעים'){
                        portfolio = Number(salary['גודל תיק']);
                    }
                    if (agents[salaryIdType] && salary[type]) {
                        agentPaymentDetails = agents[salaryIdType];
                        pd = agentPaymentDetails.pd;
                        amount = Number(salary[type]);
                        calculatedAmount = amount;
                        calculatedAmount *= Number(pd.agentPart) / 100;
                        agencyAmount = amount;
                        agencyAmount *= Number(pd.agencyPart) / 100;
                        salaryTasks.push(addSalary.bind(null, agentPaymentDetails.idNumber, salary['מספר סוכן'], paymentDate, amount, calculatedAmount, agencyAmount, type, company, portfolio*Number(pd.agentPart)/100, fileId, '', 'agent', null));

                    }
                    if (partnerships[salaryIdType] && salary[type]) {
                        partnershipId = partnerships[salaryIdType].pid;
                        partnershipPaymentDetails = partnerships[salaryIdType];
                        agentsDetails = partnershipPaymentDetails.agentsDetails;
                        pd = partnershipPaymentDetails.pd;
                        amount = Number(salary[type]);
                        salaryTasks.push(calculatePartnershipSalary.bind(null,partnershipId, salary['מספר סוכן'], agentsDetails, pd, paymentDate, amount, type, company, portfolio, fileId,''));
                    }
                })
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