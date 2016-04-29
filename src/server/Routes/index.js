/**
 * Created by efishtain on 25/04/2016.
 */


var express = require('express');
var passport = require('passport');
var multer = require('multer');
var upload = multer({ dest: 'uploads/' });
var excel = require('../Modules/excelAnalyzer');
var agents = require('../Modules/agents');

module.exports.registerRoutes = function(app){
    var publicRouter = express.Router();
    app.use('/',publicRouter);

    var apiRouter = express.Router();
    apiRouter.all('*', passport.authenticate('api', {session: false}));
    //apiRouter.post('/analyze',upload.single('file'),excel.analyze);
    apiRouter.post('/analyze',excel.analyze);
    apiRouter.get('/agent/salaries/year/:year/month/:month',agents.getSalariesForDate);
    //Agents
    apiRouter.get('/agent/:id',agents.getAgent);
    apiRouter.post('/agent',agents.addAgent);
    apiRouter.get('/agent/:id/delete', agents.deleteAgent);
    app.use('/api/v1',apiRouter);

};