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
    publicRouter.post('/commissions/upload',upload.single('file'),salaries.uploadSalariesFile);
    //publicRouter.get('/file',function(req,res){
    //    const result ="<form method=\"post\" enctype=\"multipart/form-data\" action=\"/file\"><input type=\"hidden\" name=\"msgtype\" value=\"2\"/> <input type=\"file\" name=\"file\" /> <input type=\"submit\" value=\"Upload\" /> </form>"
    //    res.send(result);
    //    res.end();
    //});
    app.use('/',publicRouter);

    var apiRouter = express.Router();
    apiRouter.get('/agent');
    //apiRouter.all('*', passport.authenticate('api', {session: false}));
    //apiRouter.post('/analyze',upload.single('file'),excel.analyze);
    ////apiRouter.post('/analyze',excel.analyze);
    //
    ////Agents
    //apiRouter.get('/agent/:id',agents.getAgent);
    //apiRouter.post('/agent',agents.addAgent);
    //apiRouter.get('/agent/:id/delete', agents.deleteAgent);
    //apiRouter.get('/salaries', salaries.uploadSalariesFile);



    app.use('/api/v1',apiRouter);

};