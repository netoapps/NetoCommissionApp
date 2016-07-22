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
    req.file ={path: 'TestData/tdd.xlsx'};
    if(!req.file){
        return res.status(400).json({err: 'invalid file'});
    }
    var data = req.body;
    if(!data ||!paymentDate || !data.company){
        return res.status(400).json({err: 'missing data (paymentDate/company)'});
    }
    data.taxValue = data.taxValue || 1.0;
    fileService.saveFileToDb(req.file,data, function (err, newPath) {
        if (err) {
            return res.status(400).json({err: err});
        }
        return res.status(200).json({msg:'all done'});
        //analyzer.analyzeSalaryFile(newPath, function (err, salaries) {
        //    if (err) {
        //        return res.status(400).json({err: err});
        //    }
        //    salaryService.processSalaries(data.month, data.year, data.companyName,data.maamRate, salaries, function (err, results) {
        //        if (err) {
        //            return res.status(400).json(err);
        //        }
        //        return res.status(200).json({msg:'all done'});
        //    });
        //});
    });

}

function getSalariesForAgenyByMonthAndYear(req,res){
    salaryService.getAgentSalariesForMonthsAndYear(req.params.agentId,req.params.startMonth,req.params.endMonth,req.params.startYear,req.params.endYear,function(err, salaries){
        if(err){
            return res.status(400).json({err:err});
        }
        return res.status(200).json({salaries:salaries});
    })
}

function getAllAgentSalaries(req,res){
    if(!req.params.agentId){
        return res.status(200).json({err:'missing agent id'});
    }
    salaryService.getAllAgentSalaries(req.params.agentId,function(err, salaries){
        if(err){
            return res.status(400).json({err:err});
        }
        return res.status(200).json({salaries:salaries});
    })
}

function getAgentSalariesByMonthYearType(req, res){
    if(!req.params.agentId){
        return res.status(200).json({err:'missing agent id'});
    }
    if(!req.body || !req.body.month || !req.body.year){
        return res.status(200).json({err:'missing month/year'});
    }
    salaryService.getAgentSalariesByMonthYearAndType(req.params.agentId,req.body.month,req.body.year,function(err,salaries){
        if(err){
            return res.status(400).json({err:err});
        }
        return res.status(200).json({salaries:salaries});
    })
}
module.exports = {uploadSalariesFile,getSalariesForAgenyByMonthAndYear,getAllAgentSalaries,getAgentSalariesByMonthYearType};