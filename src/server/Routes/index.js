/**
 * Created by efishtain on 25/04/2016.
 */


var express = require('express');
var passport = require('passport');
var multer = require('multer');
var upload = multer({ dest: '../../uploads/' });

var agents = require('../Modules/agents');
var salaries = require('../Modules/salaries');
var files = require('../Modules/files');
var constants = require('../Modules/constants');
var expanses = require('../Modules/expanses');
module.exports.registerRoutes = function(app){
    var publicRouter = express.Router();
    app.use('/',publicRouter);

    var apiRouter = express.Router();
    //APIs
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
    apiRouter.post('/commissions/upload',upload.single('file'),salaries.uploadSalariesFile);
    apiRouter.get('/agent/:idNumber/salary/bytypes/:paymentDate',salaries.getAgentSalariesSumForDate);
    apiRouter.get('/agent/:idNumber/salary/:startDate/:endDate', salaries.getSalariesForAgentByDate);
    apiRouter.post('/agent/:idNumber/salary', salaries.addAgentSalary);
    apiRouter.put('/agent/:idNumber/salary/:salaryId', salaries.updateAgentSalary);
    apiRouter.delete('/agent/:idNumber/salary/:salaryId', salaries.deleteSalary);

    apiRouter.get('/agent/:idNumber/portfolio/:paymentDate', salaries.getAgentPortfolioForDate);
    apiRouter.get('/salary',salaries.getAllSalariesSortedByDate);

    apiRouter.get('/salary/bymonths/:year/:type',salaries.getAllSalariesForYearGroupedByMonths);
    apiRouter.get('/salary/byId/:paymentDate/:type/', salaries.getAllSalariesForDateAndTypeGroupedByIdNumber);
    apiRouter.get('/salary/:paymentDate/count',salaries.getNumberOfPayedAgentsForMonth);
    apiRouter.get('/salary/:paymentDate/:type/', salaries.getDateSalariesSummedByType);




    //Expanses
    apiRouter.get('/agent/:agentId/expanses/:startDate/:endDate',expanses.getAgentExpanseForDate);
    apiRouter.post('/agent/:idNumber/expanse', expanses.addExpanseToAgentAtDate);
    apiRouter.put('/agent/:idNumber/expanse/:expanseId', expanses.updateExpanse);
    apiRouter.delete('/agent/:idNumber/expanse/:expanseId', expanses.deleteExpanse);

    //Files
    apiRouter.get('/file',files.getAllFiles);
    apiRouter.delete('/file/:fileId',files.deleteFile);
    apiRouter.get('/file/:fileId/download', files.downloadFile);
    //Delete file

    //Other
    apiRouter.get('/constants/companies', constants.getCompanyNames);
    apiRouter.get('/constants/commissions', constants.getCommisionTypes);

    app.use('/api/v1',apiRouter);

};