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
                    var val = s[k].replace(',', '').trim();
                    val = Number(val);
                    if (!_.isNaN(val)) {
                        obj[numVal] = val;
                    }
                }
            });
            return obj;
        });
        salaries = _.filter(salaries, function (s) {
            var oneFound = '1' in s || 1 in s;
            //var twoFound = '2' in s || 2 in s;
            return oneFound;
        });
        return cb(null, salaries);

    };

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
            function (cb) {
                _.map(agents, function (agent) {
                    var aName = agent['סוכן'];
                    var ID = agent.ID;
                    var nameToSplit;
                    if (aName.indexOf('-') !== -1) {
                        nameToSplit = aName.split('-');
                        //if(!nameToIds[nameToSplit[0]]) {
                        //    nameToIds[nameToSplit[0]] = ID;
                        //}
                        len--;
                        if (len===1){
                            return cb();
                        }

                    } else if (aName.indexOf('/') !== -1) {
                        nameToSplit = aName.split('/');
                        //if(!nameToIds[nameToSplit[0]]) {
                        //    nameToIds[nameToSplit[0]] = ID;
                        //}
                        len--;
                        if (len===1){
                            return cb();
                        }

                    } else if (aName.indexOf('+') !== -1) {
                        nameToSplit = aName.split('+');
                        //if(!nameToIds[nameToSplit[0]]) {
                        //    nameToIds[nameToSplit[0]] = ID;
                        //}
                        len--;
                        if (len===1){
                            return cb();
                        }
                    } else {
                            if (!nameToIds[aName]) {
                                nameToIds[aName] = ID;
                            }
                    }



                    //if(nameToSplit!=null){
                    //    if (!nameToIds[nameToSplit[0]]) {
                    //        nameToIds[nameToSplit[0]] = ID;
                    //    }
                    //}else{
                    //    if (!nameToIds[aName]) {
                    //        nameToIds[aName] = ID;
                    //    }
                    //}

                    if (ID && ID.indexOf('-') === -1 && aName.indexOf('/') === -1 && aName.indexOf('+') === -1) {
                        delete  agent.ID;
                        delete agent['סוכן'];
                        var splitName = aName.split(' ');
                        _.mapObject(agent, function (aid, compName) {

                            var pd = {companyName: compName, agentNumber: aid};
                            agentService.addAgent(ID, splitName[0], splitName[1], '', '', '', true, [pd])
                                .then(function () {
                                    console.log('created agent ' + ID);
                                    len--;
                                    if (len === 1) {
                                        return cb();
                                    }
                                })
                                .catch(function () {
                                    console.log('ID ' + ID + ' already in system');
                                    len--;
                                    if (len === 1) {
                                        return cb();
                                    }
                                })
                        });
                    }
                });
            }
        ], function (err) {
            _.map(agents, function (agent) {
                var aName = agent['סוכן'];
                if (!aName) {
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

                var firstAgent, firstAgentId, secondAgent, secondAgentId, thirdAgent, thirdAgentId;
                var agentsDetails;
                if(aName.length===2){
                    firstAgent = aName[0];
                    firstAgentId = nameToIds[firstAgent];
                    secondAgent = aName[1];
                    secondAgentId = nameToIds[secondAgent];
                    if (firstAgent && firstAgentId && secondAgent && secondAgentId) {
                        agentsDetails = [{idNumber: firstAgentId, part: 50}, {idNumber: secondAgentId, part: 50}];
                        var pd2 = [];
                        _.mapObject(agent, function (aid, compName) {
                            pd2.push({
                                companyName: compName,
                                partnershipNumber: aid,
                                paymentType: 'נפרעים',
                                partnershipPart: 50,
                                agencyPart: 50
                            });
                        })
                        agentService.addPartnership(agentsDetails, true, pd2)
                            .then(function () {
                                console.log('created partnership ' + aid);
                            })
                            .catch(function () {
                                console.log('ID ' + ait + ' already in system');
                            })
                    }
                }else if(aName.length===3){
                    firstAgent = aName[0];
                    firstAgentId = nameToIds[firstAgent];
                    secondAgent = aName[1];
                    secondAgentId = nameToIds[secondAgent];
                    thirdAgent = aName[2];
                    thirdAgentId = nameToIds[thirdAgent];
                    if (firstAgent && firstAgentId && secondAgent && secondAgentId && thirdAgent && thirdAgentId) {
                        agentsDetails = [{idNumber: firstAgentId, part: 33}, {idNumber: secondAgentId, part: 33},{idNumber:thirdAgentId,part:34}];
                         var pd3 =[];
                        _.mapObject(agent, function (aid, compName) {
                            pd3.push({
                                companyName: compName,
                                partnershipNumber: aid,
                                paymentType: 'נפרעים',
                                partnershipPart: 50,
                                agencyPart: 50
                            })
                        })
                        agentService.addPartnership(agentsDetails, true, pd3)
                            .then(function () {
                                console.log('created partnership ' + aid);
                            })
                            .catch(function () {
                                console.log('ID ' + ait + ' already in system');
                            })
                    }
                }

                console.log('done');
            })
        })


    }
}


module.exports = ExcelAnalyzerService;