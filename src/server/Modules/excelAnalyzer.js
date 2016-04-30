/**
 * Created by efishtain on 25/04/2016.
 */

var fs = require('fs');
var xlsx = require('xlsx');
var async = require('async');
var Agent = require('../Models/agent');

module.exports.analyze = function (req, res) {
    if (!req.body || !req.body.params ||!req.body.params.companyName) {
        return res.status(400).json({err: 'missing company name'});
    }
    if (!req.file || req.file === 'undefined') {
        return res.status(400).json({err: 'failed upload file'});
    }
    
    var companyName = req.body.params.companyName;
    var salaryParams = req.body.params;
    var today = new Date();

    console.log('doing company: ' + companyName);
    try {
        var workbook = xlsx.readFile(req.file.path);
        fs.unlink(req.file.path);
    }catch(err){
        return res.status(400).json({err: err});
    }
    var salaries = xlsx.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
    async.each(salaries, function (value, callback) {
        var agentId = value['1'];
        var amount = Number(value['2']);
        var caseSize = Number(value['3']); //Not used for now
        var salary = {
            month:          salaryParams.month || today.getMonth()+1,
            day:            salaryParams.day || today.getDay(),
            year:           salaryParams.year || today.getFullYear(),
            caseSize:       caseSize,
            salary:         amount,
            companyName:    companyName
        };
        Agent.findById(agentId, function(err, agent){
            if(err){
                return callback(err);
            }
            if(!agent){
                //Invalid agent ID?
            }
            if(!agent.groupedAgent.isGrouped){
                agent.salaries.push(salary);
                agent.save(function(err){
                    return callback();
                });
            }else{
                var ids = agent.groupedAgent.ids;
                async.each(ids,function(groupedAgent, gaCallback){
                    var copySalary = salary;
                    copySalary.amount = salary.amount*groupedAgent.percent;
                    Agent.update({_id:groupedAgent.agentId},{'$push':{'salaries':copySalary}},function(err, numAffected){
                        if(err){
                            return gaCallback(err);
                        }
                        return gaCallback(null);
                    });
                },function(err){
                    return callback();
                });
            }
        });

    }, function (err, result) {
        if (err) {
            return res.status(400).json({err:err});
        }
        return res.status(200).json({ok:'ok'});
    });

};