/**
 * Created by efishtain on 25/04/2016.
 */


var express = require('express');
var passport = require('passport');
var auth = require('../Auth/passport');
var multer = require('multer');

var upload = multer({ dest: '../../uploads/' });

var agents = require('../Modules/agents');
var salaries = require('../Modules/salaries');
var files = require('../Modules/files');
var constants = require('../Modules/constants');
var expanses = require('../Modules/expanses');
var excel = require('../Modules/excel');
module.exports.registerRoutes = function(app){
    auth.init(app);
    var publicRouter = express.Router();
    app.use('/',publicRouter);

    var apiRouter = express.Router();

    //APIs
    apiRouter.post('/excel_columns',upload.single('file'),excel.analyzeColumns);
    apiRouter.post('/excel_report',excel.generateAndDownloadSalaryReport);
    apiRouter.post('/commissions/upload',upload.single('file'),salaries.uploadSalariesFile);
    apiRouter.all('*',passport.authenticate('api', {session:false}))
    //Agents
    apiRouter.get('/agent', agents.getAllAgents);
    apiRouter.get('/agent/:agentId', agents.getAgentById);
    apiRouter.post('/agent', agents.addAgent);
    apiRouter.put('/agent/:agentId',agents.editAgent);
    apiRouter.delete('/agent/:agentId', agents.deleteAgent);
    apiRouter.get('/partnership', agents.getAllPartnerships);
    apiRouter.get('/partnership/:partnershipId', agents.getPartnershipById);
    apiRouter.post('/partnership', agents.addPartnership);
    apiRouter.put('/partnership/:partnershipId',agents.editPartnership);
    apiRouter.delete('/partnership/:partnershipId', agents.deletePartnership);

    //Salary
    apiRouter.get('/agent/:idNumber/salary/bytypes/:paymentDate',salaries.getAgentSalariesForDate);
    apiRouter.get('/agent/:idNumber/salary/bytypes_summed/:paymentDate',salaries.getAllAgentSalariesByTypesForDateSummed);
    apiRouter.get('/partnership/:pid/salary/bytypes_summed/:paymentDate',salaries.getAllPartnershipSalariesByTypesForDateSummed);
    apiRouter.get('/agent/:idNumber/salary/by_company_and_types_summed/:paymentDate',salaries.getAgentIdSalariesByCompanyAndTypesForDateSummed);
    apiRouter.get('/agent/:idNumber/salary/by_company_and_types_summed_manual/:paymentDate',salaries.getAgentIdSalariesByCompanyAndTypesForDateSummedManual);
    apiRouter.get('/partnership/:pid/salary/by_company_and_types_summed/:paymentDate',salaries.getPartnershipIdSalariesByCompanyAndTypesForDateSummed);
    apiRouter.get('/partnership/:pid/salary/by_company_and_types_summed_manual/:paymentDate',salaries.getPartnershipIdSalariesByCompanyAndTypesForDateSummedManual);

    apiRouter.get('/agent/:idNumber/salary/:startDate/:endDate', salaries.getSalariesForAgentByDate);
    apiRouter.post('/agent/:idNumber/salary', salaries.addAgentSalary);
    apiRouter.post('/partnership/:pid/salary', salaries.addPartnershipSalary);
    apiRouter.put('/agent/:idNumber/salary/:salaryId', salaries.updateAgentSalary);
    apiRouter.put('/partnership/:pid/salary/:salaryId', salaries.updatePartnershipSalary);
    apiRouter.delete('/agent/:idNumber/salary/:salaryId', salaries.deleteSalary);
    apiRouter.delete('/partnership/:pid/salary/:salaryId', salaries.deleteSalary);

    apiRouter.get('/agent/:idNumber/portfolio/:paymentDate', salaries.getAgentPortfolioForDate);
    apiRouter.get('/partnership/:pid/portfolio/:paymentDate', salaries.getPartnershipPortfolioForDate);
    apiRouter.get('/salary',salaries.getAllSalariesSortedByDate);
    apiRouter.get('/salary/by_company_types_summed/:paymentDate',salaries.getAllAgentsSalariesByCompanyAndTypesForDateSummed);
    apiRouter.get('/salary/bymonths/:year/:type',salaries.getAllSalariesForYearGroupedByMonths);
    apiRouter.get('/salary/byId/:paymentDate/:type/', salaries.getAllSalariesForDateAndTypeGroupedByIdNumber);
    apiRouter.get('/salary/:paymentDate/count',salaries.getNumberOfPayedAgentsForMonth);
    apiRouter.get('/salary/:paymentDate/:type/', salaries.getDateSalariesSummedByType);
    apiRouter.get('/salary/partnership/:paymentDate/:type/', salaries.getPartnershipDateSalariesSummedByType);

    //Expanses
    apiRouter.get('/agent/:idNumber/expenses/:paymentDate/',expanses.getAgentExpanseForDate);
    apiRouter.post('/agent/:idNumber/expense', expanses.addExpanseToAgentAtDate);
    apiRouter.put('/agent/:idNumber/expense/:expenseId', expanses.updateExpanse);
    apiRouter.delete('/agent/:idNumber/expense/:expenseId', expanses.deleteExpanse);

    apiRouter.get('/partnership/:pid/expenses/:paymentDate/',expanses.getPartnershipExpanseForDate);
    apiRouter.post('/partnership/:pid/expense', expanses.addExpanseToPartnershipAtDate);
    apiRouter.put('/partnership/:pid/expense/:expenseId', expanses.updatePartnershipExpense);
    apiRouter.delete('/partnership/:pid/expense/:expenseId', expanses.deletePartnershipExpense);

    //Files
    apiRouter.get('/file',files.getAllFiles);
    apiRouter.delete('/file/:fileId',files.deleteFile);
    apiRouter.get('/file/:fileId/download', files.downloadFile);
    //Delete file

    //Other
    apiRouter.get('/constants/companies', constants.getCompanies);
    apiRouter.get('/constants/commissions', constants.getCommissions);
    apiRouter.post('/constants/companies/:company', constants.addCompany);
    //apiRouter.put('/constants/companies', constants.updateCompaniesList);
    apiRouter.put('/constants/companies/:companyId/name/:name', constants.updateCompany);
    apiRouter.delete('/constants/companies/:companyId', constants.removeCompany);

    app.use('/api/v1',apiRouter);

};