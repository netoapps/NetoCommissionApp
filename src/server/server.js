/**
 * Created by efishtain on 25/04/2016.
 */
var ConstantService = require('./Services/constantService');
var constantService = new ConstantService();
constantService.init()
var config = require('./config');
var mongoose = require('mongoose');
var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var routing = require('./Routes');
var passport = require('./Auth/passport');

var async = require('async')
var fs = require('fs')
var path = require('path')

function NetoCommisionAppServer() {
    var self = this;

    self.init = function () {

        //Start express application
        var app = express();
        //app.use(morgan('Request::method URL::url ResponseTime::response-time'));
        app.use(bodyParser.json({limit: '50mb'}));
        app.use(bodyParser.urlencoded({extended: true, limit: '50mb'}));
        app.use(express.static(__dirname + '/../client')); //Should be changed to public directory
        app.use(morgan('Request::method URL::url ResponseTime::response-time')); //Some logging
        //Init passport
        passport.init(app);


        ////// to start without mongoose //////
        var nodb = false;
        process.argv.forEach(function (val, index, array) {
            if (val === "nodb") {
                nodb = true;
            }
        });
        //connect to database
        if (!nodb) {
            mongoose.connect(config.db.connectionString, config.db.options);
        }
        ///////////////////////////////////////

        //Set API/Auth routings
        routing.registerRoutes(app);

        //save app to server instance
        self.app = app;
    };

    self.start = function () {
        const port = process.env.PORT || 8090;
        var server = self.app.listen(port, function () {
            console.log('started server, listening on: ' + port);
        });
        server.timeout = 1000 * 60 * 5 //Set timeout of 5 min
    };
}

var server = new NetoCommisionAppServer();
server.init();
server.start();

var Ea = require('./Services/excelAnalyzerService');
var ea = new Ea();

const companyFilesDir = 'companyFiles'
function analyzeAgentNumbers(filePath, cb) {
    var companyName = filePath.split('.')[0]
    constantService.getCompanyIdByName(companyName)
        .then(function (companyId) {
            const agentNumbersInCompanyPath = path.join(companyFilesDir, filePath)
            ea.analyzeAgentNumbersFile(companyId, agentNumbersInCompanyPath, function (err) {
                if (err) {
                    return cb(filePath+' err: '+err)
                }
                return cb()
            })
        })
        .catch(function (err) {
            return cb(filePath + ' err: ' + err)
        })

}
function analyzeCompanies(cb) {
    fs.readdir('companyFiles', function (err, files) {
        if (err) {
            console.log(err)
            process.exit(1)
        }
        var tasks = files.filter(function(f){
            return path.extname(f)==='.xlsx' && f.indexOf('~')===-1
        }).reduce(function (all, file) {
            all.push(analyzeAgentNumbers.bind(null, file))
            return all
        }, [])
        async.series(tasks, function (err, results) {
            if (err) {
                console.log('problem with files: ' + err)
                process.exit(1)
            }
            console.log('done all company files successfully')
            if(cb){
                return cb()
            }
        })
    })
}

function analyzeAgents(cb) {
    const agentIdsFileName = 'aid.xlsx'
    ea.analyzeAgentsIdsFile(agentIdsFileName, function (err) {
        if (err) {
            console.log(err);
            process.exit(1)
        }
        console.log('done agent ids')
        if(cb){
            return cb()
        }
    })
}
//There should be a directory with all the company files, directory name: companyFiles
//the agents files can be any file, I called it aid.xlsx and it is in the root folder of the server, not in companyFiles directory


//run this function ones to add all agents to db
//then comment the line the unmark the second function and restart the server
//analyzeAgents()
//analyzeCompanies()

