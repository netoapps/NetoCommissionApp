/**
 * Created by efishtain on 19/05/2016.
 */
var xlsx = require('xlsx');
var AgentsService = require('./agentsService');
var _ = require('underscore');
var async = require('async');

function ExcelAnalyzerService() {
    this.analyzeSalaryFile = function (filePath, cb) {
        try {
            var workbook = xlsx.readFile(filePath);
        } catch (err) {
            return cb(err);
        }
        const COLS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
        const ROWS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        var worksheet = workbook.Sheets[workbook.SheetNames[0]];
        var headersRowNumber = -1;
        var cell, c, r, matches = 0;
        for (r in ROWS) {
            for (c in COLS) {
                cell = worksheet[COLS[c] + ROWS[r]]
                if (cell) {
                    if (cell.t === 'n' && (cell.v === 1 || cell.v === 2 || cell.v === 3)) {
                        matches++;
                        if (matches >= 3) {
                            headersRowNumber = ROWS[r];
                            break;
                        }
                    }
                }
            }
            if (headersRowNumber !== -1) {
                break;
            }
        }


        var salaries = xlsx.utils.sheet_to_json(worksheet, {range: headersRowNumber - 1});

        salaries = _.map(salaries, function (s) {
            var obj = {};
            var keys = _.keys(s);
            _.map(keys, function (k) {
                //k = k.trim();
                var numVal = parseInt(k);
                if (!_.isNaN(numVal)) {
                    var val = s[k].replace(',','').trim();
                    val = Number(val);
                    obj[numVal] = val;
                }
            });
            return obj;
        })
        salaries = _.filter(salaries, function (s) {
            var oneFound = '1' in s || 1 in s;
            var twoFound = '2' in s || 2 in s;
            return oneFound && twoFound;
        })
        return cb(null, salaries);
//        var salaries = xlsx.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
        //      return cb(null, salaries);
    }
    this.analyzeAgentsFile = function (filePath, cb) {
        try {
            var workbook = xlsx.readFile(filePath);
        } catch (err) {
            return cb(err);
        }
        var agentService = new AgentsService();
        var worksheet = workbook.Sheets[workbook.SheetNames[0]];

        var agents = xlsx.utils.sheet_to_json(worksheet);
        var nameToIds = {};
        var len = agents.length;
        async.series([
            function(cb){
                _.map(agents, function (agent) {
                    var aName = agent['סוכן'];
                    var ID = agent.ID;
                    if (!nameToIds[aName]) {
                        nameToIds[aName] = ID;
                    }
                    if(ID && ID.indexOf('-')===-1 && aName.indexOf('/')===-1 && aName.indexOf('+')===-1 ){
                        delete  agent.ID;
                        delete agent['סוכן'];
                        _.mapObject(agent, function(aid, compName){
                            agentService.addAgent(ID,aName,aid, compName)
                                .then(function(){
                                    console.log('created agent '+ID);
                                    len--;
                                    if(len===1){
                                        return cb();
                                    }
                                })
                                .catch(function(){
                                    console.log('ID '+ID+' already in system');
                                    len--;
                                    if(len===1){
                                        return cb();
                                    }
                                })
                        });
                    }
                });
            }
        ],function(err){
            _.map(agents, function (agent) {
                var aName = agent['סוכן'];
                if(!aName){
                    return;
                }
                if (aName.indexOf('-') !== -1) {
                    aName = aName.split('-');
                } else if (aName.indexOf('/') !== -1) {
                    aName = aName.split('/');
                } else if (aName.indexOf('+') !== -1) {
                    aName = aName.split('+');
                } else {
                    return;
                }
                delete  agent.ID;
                delete agent['סוכן'];
                _.mapObject(agent, function (aid, compName) {
                    var firstAgent = aName[0];
                    var firstAgentId = nameToIds[firstAgent];
                    if (firstAgentId) {
                        agentService.addAgent(firstAgentId, firstAgent, aid, compName)
                            .then(function () {
                                console.log('created agent ' + firstAgentId);
                            })
                            .catch(function () {
                                console.log('ID ' + firstAgentId + ' already in system');
                            })
                    }
                    var secondAgent = aName[1];
                    var secondAgentId = nameToIds[secondAgent];
                    if (secondAgentId) {
                        agentService.addAgent(secondAgentId, secondAgent, aid, compName)
                            .then(function () {
                                console.log('created agent ' + secondAgentId);
                            })
                            .catch(function () {
                                console.log('ID ' + secondAgentId + ' already in system');
                            })
                    }
                })
                console.log('done');
            })
        })


    }
}


module.exports = ExcelAnalyzerService;