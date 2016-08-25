/**
 * Created by efishtain on 25/04/2016.
 */

var ExcelAnalyzerService = require('../Services/ExcelAnalyzerService');
var fs = require('fs');
module.exports.analyzeColumns = function (req, res) {
    var analyzer = new ExcelAnalyzerService();
    if(!req.file){
        return res.status(400).json({err:'missing file'});
    }

    analyzer.analyzeColumns(req.file.path, function (err, result) {
        fs.unlink(req.file.path);
        if (err) {
            return res.status(400).json({err: err});
        }
        return res.status(200).json(result);
    });
}

//
//module.exports.analyze = function (req, res) {
//    if (!req.body || !req.body.params ||!req.body.params.companyName) {
//        return res.status(400).json({err: 'missing company name'});
//    }
//    if (!req.file || req.file === 'undefined') {
//        return res.status(400).json({err: 'failed upload file'});
//    }
//
//    var companyName = req.body.params.companyName;
//    var salaryParams = req.body.params;
//    var today = new Date();
//
//    console.log('doing company: ' + companyName);
//    try {
//        var workbook = xlsx.readFile(req.file.path);
//        fs.unlink(req.file.path);
//    }catch(err){
//        return res.status(400).json({err: err});
//    }
//    var salaries = xlsx.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
//    async.each(salaries, function (value, callback) {
//        var agentId = value['1'];
//        var amount = Number(value['2']);
//        var caseSize = Number(value['3']); //Not used for now
//        var salary = {
//            month:          salaryParams.month || today.getMonth()+1,
//            day:            salaryParams.day || today.getDay(),
//            year:           salaryParams.year || today.getFullYear(),
//            caseSize:       caseSize,
//            salary:         amount,
//            companyName:    companyName
//        };
//
//        Agent.find({'agentIds.id':agentId,company:companyName}, function(err, agents){
//            if(err){
//                return callback(err);
//            }
//            if(!agents || agents.length===0){
//                //?
//            }
//            if(agents.length===1){
//                agents[0].salaries.push(salary);
//                agents[0].save(function(err){
//                    return callback();
//                })
//            }else{
//                async.each(agents,function(ag, updateCallback){
//                    var partialSalary = salary;
//                    var accountDetails = _.find(ag.agentIds, function(account){
//                        return account.companyName === companyName;
//                    });
//                    partialSalary.salary*=accountDetails.percent;
//                    ag.salaries.push(partialSalary);
//                    ag.save(function(err){
//                        return updateCallback();
//                    })
//                }, function(err){
//                    return callback();
//                })
//            }
//        });
//
//    }, function (err, result) {
//        if (err) {
//            return res.status(400).json({err:err});
//        }
//        return res.status(200).json({ok:'ok'});
//    });
//
//};