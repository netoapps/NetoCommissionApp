/**
 * Created by efishtain on 19/05/2016.
 */

var Salary = require('../Models/salary');
var Agent = require('../Models/agent');
var _ = require('underscore');
var async = require('async');

function SalaryService() {

    this.getAgentSalaries = function (agentId, cb) {
        Salary.find({agentId: agentId}, function (err, salaries) {
            return cb(null, salaries);
        })
    };
    this.getAgentSalariesForMonths = function (agentId, startMonth, endMonth, startYear, endYear, cb) {
        //Salary.find({agentId:agentId, month:{'$ge':startMonth},}, function(err, salaries){
        //    return cb(null, salaries);
        //})
    };

    this.deleteSalary = function (agentIds) {

    };

    this.deleteAgentSalaries = function () {

    };


    function checkAgentIds(salaries) {
        return new Promise(function (resolve, reject) {
            var missingIds = {};
            var mappings={};
            async.each(salaries,
                function (salary, cb) {
                    Agent.findOne({companyAgentId:salary[1]}).lean().exec(function(err, agent){
                       if(err){
                           return reject(err);
                       }
                        if(!agent){
                            missingIds[salary[1]]=true;
                            return cb();
                        }
                        mappings[salary[1]]=agent.agentId;
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

    function addSalaryToAgent(agentId, agentInCompanyId, month, year, amount, type, companyName, cb) {
        var salary = new Salary();
        salary.agentId = agentId;
        salary.agentInCompanyId = agentInCompanyId;
        salary.month = month;
        salary.year = year;
        salary.amount = amount;
        salary.type = type;
        salary.companyName=companyName;
        salary.save(function (err) {
            if (typeof cb === 'function') {
                return cb(null);
            }
        })

    };

    function saveSalaries(month, year, companyName, salaries, agentMapping) {
        return new Promise(function (resolve, reject) {
            async.each(salaries,
                function (salary, cb) {
                    if(agentMapping[salary[1]]) {

                        var amount, type;
                        if (salary[3]) {
                            amount = salary[3];
                            type = 3;
                        }
                        else if (salary[4]) {
                            amount = salary[4];
                            type = 4;
                        }
                        else if (salary[5]) {
                            amount = salary[5];
                            type = 5;
                        } else {
                            return reject('invalid file, missing salary');
                        }
                        addSalaryToAgent(agentMapping[salary[1]], salary[1], month, year, amount, type, companyName, cb);
                    }else{
                        console.log('invalid mapping');
                        return cb();
                    }
                },
                function (err) {
                    if (err) {
                        return reject(err);
                    }
                    return resolve();
                })
        });
    }

    function mapSalaries(salaries){

    }

    this.processSalaries = function (month, year, companyName, salaries, cb) {
        salaries = _.groupBy(salaries,function(sal){return sal[1]});

        console.log(salaries);
        return cb();
        //checkAgentIds(salaries)
        //    .then(saveSalaries.bind(null,month, year, companyName,salaries))
        //    .then(function(){
        //        return cb();
        //    })
        //    .catch(function (err) {
        //        cb(err);
        //    })
        //checkAgentIds(salaries)
        //    .then(mapAgentIDsToAgentId)
        //    .then(saveSalariesToAgents.bind(null,month,year,companyName,salaries))
        //    .then(function(){
        //        return cb();
        //    })
        //    .catch(function(err){
        //        return cb(err);
        //    });
    }
}

module.exports = SalaryService;