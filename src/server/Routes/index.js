/**
 * Created by efishtain on 25/04/2016.
 */


var express = require('express');
var passport = require('passport');
var multer = require('multer');
var upload = multer({ dest: '../../uploads/' });

var agents = require('../Modules/agents');
var salaries = require('../Modules/salaries');

module.exports.registerRoutes = function(app){
    var publicRouter = express.Router();
    //publicRouter.post('/commissions/upload',upload.single('file'),salaries.uploadSalariesFile);
    //publicRouter.get('/file',function(req,res){
    //    const result ="<form method=\"post\" enctype=\"multipart/form-data\" action=\"/file\"><input type=\"hidden\" name=\"msgtype\" value=\"2\"/> <input type=\"file\" name=\"file\" /> <input type=\"submit\" value=\"Upload\" /> </form>"
    //    res.send(result);
    //    res.end();
    //});
    //publicRouter.post('/salaries/:agentId/monthYearType',salaries.getAgentSalariesByMonthYearType);
    //publicRouter.get('/agents/',agents.getAllAgents);
    //publicRouter.post('/salaries',salaries.getSalariesForAgenyByMonthAndYear);

    app.use('/',publicRouter);

    var apiRouter = express.Router();
    apiRouter.get('/agent');


    //APIs
    //Agents
    apiRouter.get('/agent', agents.getAllAgents);
    apiRouter.get('/agent/:agentId', agents.getAgentById);
    apiRouter.post('/agent', agents.addAgent);
    apiRouter.put('/agent/:agentId',agents.editAgent);
    apiRouter.delete('/agent/:agentId', agents.deleteAgent);
    apiRouter.get('/partnership', agents.getAllPartnerships);
    apiRouter.post('/partnership', agents.addPartnership);
    apiRouter.put('/partnership/:partnershipId',agents.editPartnership);
    apiRouter.delete('/partnership/:partnershipId', agents.deletePartnership);

    //Salary
    //apiRouter.get('/salary', salaries.getAllAgentSalaries);
    //apiRouter.post('/salary', salaries.uploadSalariesFile);
    //apiRouter.get('/agent/:agentId/salary/:startMonth/:startYear/:endMonth/:endYear', salaries.getSalariesForAgenyByMonthAndYear);
    //apiRouter.get('/agent/:agentId/allSalaries', salaries.getAllAgentSalaries);

    //Files
    //Get all files
    //Delete file

    //Other


    app.use('/api/v1',apiRouter);

};