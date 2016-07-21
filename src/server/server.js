/**
 * Created by efishtain on 25/04/2016.
 */

var config = require('./config');
var mongoose = require('mongoose');
var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var routing = require('./Routes');
var passport = require('./Auth/passport');

function NetoCommisionAppServer(){
    var self = this;

    self.init = function(){

        //Start express application
        var app = express();
        //app.use(morgan('Request::method URL::url ResponseTime::response-time'));
        app.use(bodyParser.json({limit: '50mb'}));
        app.use(bodyParser.urlencoded({ extended: true, limit: '50mb'}));
        app.use(express.static(__dirname + '/../client')); //Should be changed to public directory
        app.use(morgan('Request::method URL::url ResponseTime::response-time')); //Some logging
        //Init passport
        passport.init(app);


        ////// to start without mongoose //////
        var nodb = false;
        process.argv.forEach(function (val, index, array) {
            if(val === "nodb")
            {
                nodb = true;
            }
        });
        //connect to database
        if (!nodb)
        {
            mongoose.connect(config.db.connectionString,config.db.options);
        }
        ///////////////////////////////////////

        //Set API/Auth routings
        routing.registerRoutes(app);

        //save app to server instance
        self.app = app;
    };

    self.start = function(){
        const port = process.env.PORT || 8090;
        self.app.listen(port , function(){
            console.log('started server, listening on: '+port);
        });
    };
}


var server = new NetoCommisionAppServer();
server.init();
server.start();

//var Ea = require('./Services/ExcelAnalyzerService');
//ea = new Ea();
//ea.analyzeAgentsFile('agents_fixed.xlsx', function(err){
//        if(err)console.log(err);
//        else console.log('done');
//})
//var _ = require('underscore');
//var AS = require('./Services/agentsService');
//var as = new AS();
//as.getAllAgents()
//    .then(function(agents){
//        var mapping = {};
//        _.each(agents,function(agent){
//            _.each(agent.paymentsDetails,function(pd){
//                mapping[pd.companyName+'-'+pd.agentNumber] = agent;
//            })
//        })
//        console.log(mapping);
//    });

