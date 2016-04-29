/**
 * Created by efishtain on 25/04/2016.
 */

var config = require('./config');
var mongoose = require('mongoose');
var express = require('express');
var bodyParser = require('body-parser');
var routing = require('./Routes');

var passport = require('./Auth/passport');


function NetoCommisionAppServer(){
    var self = this;

    self.init = function(){

        //Start express application
        var app = express();
        app.use(bodyParser.json({limit: '50mb'}));
        app.use(bodyParser.urlencoded({ extended: true, limit: '50mb'}));
        app.use(express.static(__dirname + '/../client')); //Should be changed to public directory

        //Init passport
        passport.init(app);

        //connect to database
        mongoose.connect(config.db.connectionString,config.db.options);

        //Set API/Auth routings
        routing.registerRoutes(app);

        //save app to server instance
        self.app = app;
    };

    self.start = function(){
        const port = process.env.PORT || 3000;
        self.app.listen(port , function(){
            console.log('started server, listening on: '+port);
        });
    };
}

var server = new NetoCommisionAppServer();
server.init();
server.start();

