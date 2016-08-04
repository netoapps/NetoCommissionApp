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


    this.addAgentSalary = function(idNumber, agentInCompanyId, paymentDate, amount, type, company){
        return new Promise(function(resolve, reject){
            addSalaryToAgent(idNumber,agentInCompanyId,paymentDate,amount,type,company, function(err){
                if(err){
                    return reject(err);
                }
                return resolve();
            })
        })
    }
    this.getAgentSalariesForDate = function (idNumber, startDate, endDate, cb) {
        Salary.aggregate([
            {$match: {$and: [{paymentDate: {$gte: startDate}}, {paymentDate: {$lte: endDate}}, {agentId: idNumber}]}}
        ], function (err, salaries) {
            if (err)return cb(err);
            return cb(null, salaries);
        });
    }
    this.deleteSalary = function (id) {
        return new Promise(function(resolve, reject){
            Salary.findById(id, function(err, salary){
                if(err){
                    return reject(err);
                }
                if(!salary){
                    return reject('salary not found');
                }
                salary.remove(function(err){
                    if(err){
                        return reject(err);
                    }
                    return resolve();
                })
            })
        })
    };
    this.updateSalary = function(id, agentInCompanyId, paymentDate, amount, type, company){
        return new Promise(function(resolve, reject){
            Salary.findById(id, function(err, salary){
                if(err){
                    return reject(err);
                }
                if(!salary){
                    return reject('salary not found');
                }
                salary.agentInCompanyId = agentInCompanyId;
                salary.paymentDate = paymentDate;
                salary.amount = amount;
                salary.type = type;
                salary.company = company;
                salary.save(function(err){
                    if(err){
                        return reject(err);
                    }
                    return resolve();
                })
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
    this.getNumberOfPayedSalariesForMonthGroupedById = function(paymentDate){
        return new Promise(function(resolve, reject){

            Salary.find({paymentDate:paymentDate.toISOString()}).distinct('idNumber').exec(function(err, ids){
                if(err){
                    return reject(err);
                }
                return resolve(ids.length);
            });
        })

    }
    this.getAllSalariesSortedByDate = function(){
        return new Promise(function(resolve, reject){
            Salary.find({}).sort({paymentDate:-1}).exec(function(err, salaries){
                if(err){
                    return reject(err);
                }
                return resolve(salaries);
            })
        })

    }
    this.getAllSalariesByType = function(type){
        return new Promise(function(resolve, reject){
            Salary.find({type:type},function(err, salaries){
                if(err){
                    return reject(err);
                }
                return resolve(salaries);
            })
        })

    }

    this.getAllSalariesForYearByMonths = function(year, type){
        return new Promise(function(resolve, reject){
            var fromYear = new Date(year,0,1,0,0,0,0);
            var toYear = new Date(year+1,0,1,0,0,0,0);
            Salary.aggregate([
                {$match:{paymentDate:{$gte:fromYear,$lt:toYear}, type:type}},
                {$group:{_id:{$month:'$paymentDate'}, amount:{$sum:'$amount'}}}
            ],function(err, salaries){
                if(err){
                    return reject(err);
                }
                return resolve(salaries);
            })

        })
    }

    //TODO: get all salaries for year and month and type, grouped by idNumber
    this.getAllSalariesForDateAndTypeGroupedById = function(date, type){
        return new Promise(function(resolve, reject){
            date = new Date(date);
            var prevDate = new Date(date.getTime());
            prevDate.setMonth(prevDate.getMonth()-1);
            Salary.aggregate([
                {$match:{paymentDate:{'$gte':prevDate,'$lte':date}, type:type}},
                {$group:{_id:{idNumber:'$idNumber',date:'$paymentDate'}, amount:{$sum:'$amount'}}}
            ],function(err, salaries){
                if(err){
                    return reject(err);
                }
                return resolve(salaries);
            })

        })
    }



    //Future support if needed
    this.getAllAgentSalaries = function (idNumber, cb) {
        Salary.find({agentId: idNumber}, function (err, salaries) {
            if (err) {
                return cb(err);
            }
            return cb(null, salaries);
        })
    };

    this.deleteSalariesByMonthAndYear = function(month, year){}
    this.deleteAgentSalaries = function () {

    };


    //Private functions for handling salary processing from file
    function checkAgentIds(agentsMaps, partnershipsMaps, companyName, salaries) {
        return new Promise(function (resolve, reject) {
            var missingIds = {};
            _.each(salaries,function(salary){
                var agentNumber = companyName+'-'+salary[1];
                if(!agentsMaps[agentNumber+'-'+type3] && !partnershipsMaps[agentNumber+'-'+type3] &&
                    !agentsMaps[agentNumber+'-'+type4] && !partnershipsMaps[agentNumber+'-'+type4] &&
                    !agentsMaps[agentNumber+'-'+type5] && !partnershipsMaps[agentNumber+'-'+type5]){
                    missingIds[salary[1]]=true;
                }
            });
            if (Object.keys(missingIds).length > 0) {
                return reject(Object.keys(missingIds));
            }
            return resolve();
        });
    }
    function addSalaryToAgent(idNumber, agentInCompanyId, paymentDate, amount, type, company, portfolio, cb) {
        var salary = new Salary();
        salary.idNumber = idNumber;
        salary.agentInCompanyId = agentInCompanyId;
        salary.paymentDate =paymentDate;
        salary.amount = amount;
        salary.type = type;
        salary.company = company;
        salary.portfolio = portfolio;
        salary.save(function (err) {
            if (typeof cb === 'function') {
                return cb(null);
            }
        })

    };
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
                    salaryTasks.push(addSalaryToAgent.bind(null,agentPaymentDetails.idNumber,salary[1], paymentDate, amount,type3,company, salary[2]));
                }
                if(agents[salaryIdType4] && salary[4]){
                    agentPaymentDetails = agents[salaryIdType4];
                    pd = agentPaymentDetails.pd;
                    amount = Number(salary[4]);
                    amount*=Number(pd.agentPart)/100;
                    salaryTasks.push(addSalaryToAgent.bind(null,agentPaymentDetails.idNumber,salary[1], paymentDate,amount,type4,company,0));
                }
                if(agents[salaryIdType5] && salary[5]){
                    agentPaymentDetails = agents[salaryIdType5];
                    pd = agentPaymentDetails.pd;
                    amount = Number(salary[5]);
                    amount*=Number(pd.agentPart)/100;
                    salaryTasks.push(addSalaryToAgent.bind(null,agentPaymentDetails.idNumber,salary[1], paymentDate, amount,type5,company,0));
                }
                if(partnerships[salaryIdType3] && salary[3]){
                    partnershipPaymentDetails = partnerships[salaryIdType3];
                    agentsDetails = partnershipPaymentDetails.agentsDetails;
                    pd = partnershipPaymentDetails.pd;
                    _.each(agentsDetails, function(agent){
                        amount = Number(salary[3]);
                        amount*=Number(agent.part)/100;
                        amount*=Number(pd.partnershipPart)/100;
                        salaryTasks.push(addSalaryToAgent.bind(null,agent.idNumber,salary[1], paymentDate, amount,type3,company,salary[2]));
                    })
                }
                if(partnerships[salaryIdType4] && salary[4]){
                    partnershipPaymentDetails = partnerships[salaryIdType4];
                    agentsDetails = partnershipPaymentDetails.agentsDetails;
                    pd = partnershipPaymentDetails.pd;
                    _.each(agentsDetails, function(agent){
                        amount = Number(salary[4]);
                        amount*=Number(agent.part)/100;
                        amount*=Number(pd.partnershipPart)/100;
                        salaryTasks.push(addSalaryToAgent.bind(null,agent.idNumber,salary[1], paymentDate, amount,type4,company,0));
                    })
                }
                if(partnerships[salaryIdType4] && salary[5]){
                    partnershipPaymentDetails = partnerships[salaryIdType5];
                    agentsDetails = partnershipPaymentDetails.agentsDetails;
                    pd = partnershipPaymentDetails.pd;
                    _.each(agentsDetails, function(agent){
                        amount = Number(salary[5]);
                        amount*=Number(agent.part)/100;
                        amount*=Number(pd.partnershipPart)/100;
                        salaryTasks.push(addSalaryToAgent.bind(null,agent.idNumber,salary[1], paymentDate, amount,type5,company,0));
                    })
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