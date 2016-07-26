/**
 * Created by efishtain on 19/05/2016.
 */

const SalaryService = require('../Services/salaryService');
const FileService = require('../Services/fileService');
const ExcelService = require('../Services/excelAnalyzerService');

const salaryService = new SalaryService();
const fileService = new FileService();
const analyzer = new ExcelService();

function uploadSalariesFile(req, res) {
    if(!req.file){
        return res.status(400).json({err: 'invalid file'});
    }
    try {
        var data = JSON.parse(req.body.data);
    }catch(err){
        return res.status(400).json({err:'invalid json data'});
    }
    if(!data ||!data.paymentDate || !data.company){
        return res.status(400).json({err: 'missing data (paymentDate/company)'});
    }
    data.taxValue = data.taxValue || 1.0;
    fileService.saveFileToDb(req.file,data, function (err, file) {
        if (err) {
            return res.status(400).json({err: err});
        }
        //Unmark this if you want to test only file upload without processing/analyzing
        //It will return you the file data structure

        //return res.status(200).json({file:file});
        analyzer.analyzeSalaryFile(file.pathOnDisk, function (err, salaries) {
            if (err) {
                fileService.deleteFile(file._id, function(err){
                    return res.status(400).json({err: err});
                })
            }else {
                salaryService.processSalaries(data.paymentDate, data.company, data.taxValue, salaries, function (err, results) {
                    if (err) {
                        fileService.deleteFile(file._id, function(err){
                            return res.status(400).json({err: err});
                        })
                    }
                    return res.status(200).json({file: file});
                });
            }
        });
    });

}

function getSalariesForAgentByDate(req,res){
    salaryService.getAgentSalariesForDate(req.params.agentId,req.params.startDate,req.params.endDate,function(err, salaries){
        if(err){
            return res.status(400).json({err:err});
        }
        return res.status(200).json({salaries:salaries});
    })
}

function addAgentSalary(req, res){
    if(!req.params.idNumber){
        return res.status(400).json({err:'missing id Number'});
    }
    var data = req.body;
    if(!data || !data.agentId || !data.paymentDate ||!data.amount|| !data.type|| !data.company){
        return res.status(400).json({err:'missing salary data'});
    }
    salaryService.addAgentSalary(req.params.idNumber, data.agentId, data.paymentDate, data.amount, data.type, data.company)
        .then(function(salary){
            return res.status(200).json({salary:salary});
        })
        .catch(function(err){
            return res.status(400).json({err:err});
        })
}

function updateAgentSalary(req, res){
    if(!req.params.salaryId){
        return res.status(400).json({err:'missing salary Id'});
    }
    var data = req.body;
    if(!data || !data.agentId || !data.paymentDate ||!data.amount|| !data.type|| !data.company){
        return res.status(400).json({err:'missing salary data'});
    }
    salaryService.updateSalary(req.params.salaryId, data.agentId, data.paymentDate, data.amount, data.type, data.company)
        .then(function(salary){
            return res.status(200).json({salary:salary});
        })
        .catch(function(err){
            return res.status(400).json({err:err});
        })
}

function deleteSalary(req, res){
    if(!req.params.salaryId){
        return res.status(400).json({err:'missing salary Id'});
    }
    salaryService.deleteSalary(req.params.salaryId)
        .then(function(salary){
            return res.status(200).json({});
        })
        .catch(function(err){
            return res.status(400).json({err:err});
        })
}
//function getAllAgentSalaries(req,res){
//    if(!req.params.agentId){
//        return res.status(200).json({err:'missing agent id'});
//    }
//    salaryService.getAllAgentSalaries(req.params.agentId,function(err, salaries){
//        if(err){
//            return res.status(400).json({err:err});
//        }
//        return res.status(200).json({salaries:salaries});
//    })
//}
//
//function getAgentSalariesByMonthYearType(req, res){
//    if(!req.params.agentId){
//        return res.status(200).json({err:'missing agent id'});
//    }
//    if(!req.body || !req.body.month || !req.body.year){
//        return res.status(200).json({err:'missing month/year'});
//    }
//    salaryService.getAgentSalariesByMonthYearAndType(req.params.agentId,req.body.month,req.body.year,function(err,salaries){
//        if(err){
//            return res.status(400).json({err:err});
//        }
//        return res.status(200).json({salaries:salaries});
//    })
//}
module.exports = {uploadSalariesFile,getSalariesForAgentByDate, addAgentSalary, updateAgentSalary, deleteSalary};