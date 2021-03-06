/**
 * Created by efishtain on 19/05/2016.
 */
const SalaryService = require('../Services/salaryService');
const FileService = require('../Services/fileService');
const ExcelService = require('../Services/excelAnalyzerService');

const salaryService = new SalaryService();
const fileService = new FileService();
const analyzer = new ExcelService();
var _ = require('underscore');

//CRUD AGENTS
function uploadSalariesFile(req, res) {
    if (!req.file) {
        return res.status(400).json({err: 'invalid file'});
    }
    try {
        var data = JSON.parse(req.body.data);
    } catch (err) {
        return res.status(400).json({err: 'invalid json data'});
    }
    if (!data || !data.paymentDate || !data.company) {
        return res.status(400).json({err: 'missing data (paymentDate/company)'});
    }
    data.taxValue = data.taxValue || 1.0;
    fileService.saveFileToDb(req.file, data, function (err, file) {
        if (err) {
            return res.status(400).json(err);
        }
        analyzer.analyzeSalaryFile(file.pathOnDisk,data.columnSettings, data.dataRowNumber, function (err, salaries) {
            if (err) {
                fileService.deleteFile(file._id).then(function () {
                    return res.status(400).json({err: err});
                }).catch(function (error) {
                    return res.status(400).json({err: error});
                })
            } else {
                salaryService.processSalaries(data.paymentDate, data.company, data.taxValue, salaries,file._id, function (err, results) {
                    if (err) {
                        fileService.deleteFile(file._id).then(function () {
                            return res.status(400).json(err);
                        }).catch(function (error) {
                            return res.status(400).json(error);
                        })
                    }
                    else {
                        return res.status(200).json({file: file});
                    }

                });
            }
        });
    });

}
function addAgentSalary(req, res) {
    if (!req.params.idNumber) {
        return res.status(400).json({err: 'missing id Number'});
    }
    var data = req.body;
    if (!data || !data.paymentDate || !data.amount || !data.type || !data.company) {
        return res.status(400).json({err: 'missing salary data'});
    }

    var repeatCount = data.repeat || 1;
    var salariesRequests = [];
    var startDate = new Date(data.paymentDate);

    for(var i=0;i<repeatCount;i++){
        salariesRequests.push(salaryService.addAgentSalary(req.params.idNumber, data.agentInCompanyId, startDate.toISOString(), data.amount, data.amount, data.type, data.company, data.notes || ''));
        startDate.setMonth(startDate.getMonth()+1);
    }
    Promise.all(salariesRequests)
        .then(function (salaries) {
            var salary = _.filter(salaries, function(s){
                return s.paymentDate.toISOString() === data.paymentDate;
            });
            return res.status(200).json({salary: salary.length == 0 ? null:salary[0]});
        })
        .catch(function (err) {
            return res.status(400).json({err: err});
        })
}
function updateAgentSalary(req, res) {
    if (!req.params.salaryId) {
        return res.status(400).json({err: 'missing salary Id'});
    }
    var data = req.body;
    if (!data || !data.idNumber || !data.paymentDate || !data.amount || !data.type || !data.company) {
        return res.status(400).json({err: 'missing salary data'});
    }
    //calculatedAmount = amount for manual salary
    salaryService.updateSalary(req.params.salaryId, data.idNumber, data.agentInCompanyId, data.paymentDate, data.amount, data.amount, data.type, data.company, data.notes)
        .then(function(salary) {
            return res.status(200).json({salary:salary});
        })
        .catch(function (err) {
            return res.status(400).json({err: err});
        })
}
function deleteSalary(req, res) {
    if (!req.params.salaryId) {
        return res.status(400).json({err: 'missing salary Id'});
    }
    salaryService.deleteSalary(req.params.salaryId)
        .then(function () {
            return res.status(200).json({});
        })
        .catch(function (err) {
            return res.status(400).json({err: err});
        })
}

//CRUD PARTNERSHIPS
function addPartnershipSalary(req, res){
    if (!req.params.pid) {
        return res.status(400).json({err: 'missing partnership id'});
    }
    var data = req.body;
    if (!data || !data.paymentDate || !data.amount || !data.type || !data.company) {
        return res.status(400).json({err: 'missing salary data'});
    }

    var repeatCount = data.repeat || 1;
    var salariesRequests = [];
    var startDate = new Date(data.paymentDate);
    for(var i=0;i<repeatCount;i++){
        salariesRequests.push(salaryService.addPartnershipSalary(req.params.pid, data.agentInCompanyId, startDate.toISOString(), data.amount, data.type, data.company, data.notes || ''));
        startDate.setMonth(startDate.getMonth()+1);
    }
    Promise.all(salariesRequests)
        .then(function (salaries) {
            var salary = _.filter(salaries, function(s){
                return s.paymentDate.toISOString() === data.paymentDate;
            });
            return res.status(200).json({salary: salary.length == 0 ? null:salary[0]});
        })
        .catch(function (err) {
            return res.status(400).json({err: err});
        })
}
function deletePartnershipSalary(req, res){
    if (!req.params.salaryId) {
        return res.status(400).json({err: 'missing salary Id'});
    }
    salaryService.deletePartnershipSalary(req.params.salaryId)
        .then(function () {
            return res.status(200).json({});
        })
        .catch(function (err) {
            return res.status(400).json({err: err});
        })
}
function updatePartnershipSalary(req, res) {
    if (!req.params.salaryId) {
        return res.status(400).json({err: 'missing salary Id'});
    }
    if (!req.params.pid) {
        return res.status(400).json({err: 'missing partnership Id'});
    }
    var data = req.body;
    if (!data  || !data.paymentDate || !data.amount || !data.type || !data.company) {
        return res.status(400).json({err: 'missing salary data'});
    }
    //calculatedAmount = amount for manual salary
    salaryService.deletePartnershipSalary(req.params.salaryId)
        .then(salaryService.addPartnershipSalary.bind(null, req.params.pid, data.agentInCompanyId, data.paymentDate, data.amount, data.type, data.company))
        .then(function (salary) {
            return res.status(200).json({salary: salary});
        })
        .catch(function (err) {
            return res.status(400).json({err: err});
        })
}
//Queries Agents
function getAllSalariesSortedByDate(req, res) {
    salaryService.getAllSalariesSortedByDate()
        .then(function (salaries) {
            return res.status(200).json({salaries: salaries});
        })
        .catch(function (err) {
            return res.status(400).json({err: err});
        })
}
function getSalariesForAgentByDate(req, res) {
    salaryService.getAgentSalariesForDate(req.params.agentId, req.params.startDate, req.params.endDate, function (err, salaries) {
        if (err) {
            return res.status(400).json({err: err});
        }
        return res.status(200).json({salaries: salaries});
    })
}
function getNumberOfPayedAgentsForMonth(req, res) {
    const paymentDate = req.params.paymentDate;
    if (!paymentDate) {
        return res.status(400).json({err: 'invalid payment date'});
    }
    var pd = new Date(paymentDate);
    salaryService.getNumberOfPayedSalariesForMonthGroupedById(pd)
        .then(function (count) {
            return res.status(200).json({count: count});
        })
        .catch(function (err) {
            return res.status(400).json({err: err});
        })
}
function getDateSalariesSummedByType(req, res) {
    const type = req.params.type;
    const pd = req.params.paymentDate;
    if (!type || type < 2 || type > 5) {
        return res.status(400).json({err: 'invalid type'});
    }
    var date = new Date(pd);
    salaryService.getDateSalariesSummedByType(type, date,'agent')
        .then(function (data) {
            return res.status(200).json(data);
        })
        .catch(function (err) {
            return res.status(400).json({err: err});
        })
}
function getAllSalariesForYearGroupedByMonths(req, res) {
    const year = req.params.year;
    const type = req.params.type;
    if (!year) {
        return res.status(400).json({err: 'invalid year'});
    }
    if (!type) {
        return res.status(400).json({err: 'invalid type'});
    }

    salaryService.getAllSalariesForYearByMonths(year, type)
        .then(function (salaries) {
            return res.status(200).json({salaries: salaries});
        })
        .catch(function (err) {
            return res.status(400).json({err: err});
        })
}
function getAllSalariesForDateAndTypeGroupedByIdNumber(req, res) {
    const pd = req.params.paymentDate;
    const type = req.params.type;
    if (!pd) {
        return res.status(400).json({err: 'invalid year'});
    }
    if (!type) {
        return res.status(400).json({err: 'invalid type'});
    }

    salaryService.getAllSalariesForDateAndTypeGroupedById(pd, type)
        .then(function (salaries) {
            return res.status(200).json({salaries: salaries});
        })
        .catch(function (err) {
            return res.status(400).json({err: err});
        })
}
function getAgentPortfolioForDate(req, res) {
    const idNumber = req.params.idNumber;
    const pd = req.params.paymentDate;
    if (!idNumber) {
        return res.status(400).json({err: 'invalid idNumber'});
    }
    if (!pd) {
        return res.status(400).json({err: 'invalid payment date'});
    }

    salaryService.getAgentPortfolioForDate(idNumber, pd,'agent')
        .then(function (portfolio) {
            return res.status(200).json({portfolio: portfolio});
        })
        .catch(function (err) {
            return res.status(400).json({err: err});
        })
}
function getAgentSalariesForDate(req, res){
    const idNumber = req.params.idNumber;
    const pd = req.params.paymentDate;
    if (!idNumber) {
        return res.status(400).json({err: 'invalid idNumber'});
    }
    if (!pd) {
        return res.status(400).json({err: 'invalid payment date'});
    }

    salaryService.getAllAgentSalariesByTypesForDate(idNumber, pd)
        .then(function (salaries) {
            return res.status(200).json(salaries);
        })
        .catch(function (err) {
            return res.status(400).json({err: err});
        })

}
function getAllAgentSalariesByTypesForDateSummed(req, res){
    const idNumber = req.params.idNumber;
    const pd = req.params.paymentDate;
    if (!idNumber) {
        return res.status(400).json({err: 'invalid idNumber'});
    }
    if (!pd) {
        return res.status(400).json({err: 'invalid payment date'});
    }

    salaryService.getAllIdSalariesByTypesForDateSummed(idNumber, pd,'agent')
        .then(function (salaries) {
            return res.status(200).json(salaries);
        })
        .catch(function (err) {
            return res.status(400).json({err: err});
        })

}

function getAllPartnershipSalariesByTypesForDateSummed(req, res){
    const pid = req.params.pid;
    const pd = req.params.paymentDate;
    if (!pid) {
        return res.status(400).json({err: 'pid idNumber'});
    }
    if (!pd) {
        return res.status(400).json({err: 'invalid payment date'});
    }

    salaryService.getAllIdSalariesByTypesForDateSummed(pid, pd, 'partnership')
        .then(function (salaries) {
            return res.status(200).json(salaries);
        })
        .catch(function (err) {
            return res.status(400).json({err: err});
        })

}
function getAllAgentsSalariesByCompanyAndTypesForDateSummed(req, res){
    const pd = req.params.paymentDate;
    if (!pd) {
        return res.status(400).json({err: 'invalid payment date'});
    }

    salaryService.getAllAgentsSalariesByCompanyAndTypesForDateSummed(pd)
        .then(function (salaries) {
            return res.status(200).json({salaries:salaries});
        })
        .catch(function (err) {
            return res.status(400).json({err: err});
        })
}
function getAgentIdSalariesByCompanyAndTypesForDateSummedManual(req, res){
    const idNumber = req.params.idNumber;
    if (!idNumber) {
        return res.status(400).json({err: 'invalid idNumber'});
    }
    const pd = req.params.paymentDate;
    if (!pd) {
        return res.status(400).json({err: 'invalid payment date'});
    }

    salaryService.getSalariesByCompanyAndTypesForDateSummedManual(idNumber, pd,'agent')
        .then(function (salaries) {
            return res.status(200).json({salaries:salaries});
        })
        .catch(function (err) {
            return res.status(400).json({err: err});
        })
}

function getAgentIdSalariesByCompanyAndTypesForDateSummed(req, res){
    const idNumber = req.params.idNumber;
    if (!idNumber) {
        return res.status(400).json({err: 'invalid idNumber'});
    }
    const pd = req.params.paymentDate;
    if (!pd) {
        return res.status(400).json({err: 'invalid payment date'});
    }

    salaryService.getSalariesByCompanyAndTypesForDateSummed(idNumber, pd,'agent')
        .then(function (salaries) {
            return res.status(200).json({salaries:salaries});
        })
        .catch(function (err) {
            return res.status(400).json({err: err});
        })
}

//Queries Partnerships
function getPartnershipIdSalariesByCompanyAndTypesForDateSummed(req, res){
    const pid = req.params.pid;
    if (!pid) {
        return res.status(400).json({err: 'invalid pid'});
    }
    const pd = req.params.paymentDate;
    if (!pd) {
        return res.status(400).json({err: 'invalid payment date'});
    }

    salaryService.getSalariesByCompanyAndTypesForDateSummed(pid, pd,'partnership')
        .then(function (salaries) {
            return res.status(200).json({salaries:salaries});
        })
        .catch(function (err) {
            return res.status(400).json({err: err});
        })
}


function getPartnershipIdSalariesByCompanyAndTypesForDateSummedManual(req, res){
    const pid = req.params.pid;
    if (!pid) {
        return res.status(400).json({err: 'invalid pid'});
    }
    const pd = req.params.paymentDate;
    if (!pd) {
        return res.status(400).json({err: 'invalid payment date'});
    }

    salaryService.getSalariesByCompanyAndTypesForDateSummedManual(pid, pd,'partnership')
        .then(function (salaries) {
            return res.status(200).json({salaries:salaries});
        })
        .catch(function (err) {
            return res.status(400).json({err: err});
        })
}
function getPartnershipPortfolioForDate(req, res) {
    const pid = req.params.pid;
    const pd = req.params.paymentDate;
    if (!pid) {
        return res.status(400).json({err: 'invalid pid'});
    }
    if (!pd) {
        return res.status(400).json({err: 'invalid payment date'});
    }

    salaryService.getAgentPortfolioForDate(pid, pd,'partnership')
        .then(function (portfolio) {
            return res.status(200).json({portfolio: portfolio});
        })
        .catch(function (err) {
            return res.status(400).json({err: err});
        })
}

function getPartnershipDateSalariesSummedByType(req, res) {
    const type = req.params.type;
    const pd = req.params.paymentDate;
    if (!type || type < 2 || type > 5) {
        return res.status(400).json({err: 'invalid type'});
    }
    var date = new Date(pd);
    salaryService.getDateSalariesSummedByType(type, date,'partnership')
        .then(function (data) {
            return res.status(200).json(data);
        })
        .catch(function (err) {
            return res.status(400).json({err: err});
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
module.exports = {
    uploadSalariesFile,
    getSalariesForAgentByDate,
    addAgentSalary,
    updateAgentSalary,
    deleteSalary,
    addPartnershipSalary,
    updatePartnershipSalary,
    deletePartnershipSalary,
    getNumberOfPayedAgentsForMonth,
    getAllSalariesSortedByDate,
    getDateSalariesSummedByType,
    getAllSalariesForYearGroupedByMonths,
    getAllSalariesForDateAndTypeGroupedByIdNumber,
    getAgentPortfolioForDate,
    getAgentSalariesForDate,
    getAllAgentSalariesByTypesForDateSummed,
    getAllAgentsSalariesByCompanyAndTypesForDateSummed,
    getAgentIdSalariesByCompanyAndTypesForDateSummedManual,
    getAgentIdSalariesByCompanyAndTypesForDateSummed,
    getAllPartnershipSalariesByTypesForDateSummed,
    getPartnershipIdSalariesByCompanyAndTypesForDateSummedManual,
    getPartnershipIdSalariesByCompanyAndTypesForDateSummed,
    getPartnershipPortfolioForDate,
    getPartnershipDateSalariesSummedByType
};