/**
 * Created by efishtain on 19/05/2016.
 */
var xlsx = require('xlsx');
var AgentsService = require('./agentsService');
var _ = require('underscore');
var async = require('async');

function ExcelAnalyzerService() {
    this.analyzeSalaryFile = function (filePath, columnSettings,headersRowNumber, cb) {
        try {
            var workbook = xlsx.readFile(filePath);
        } catch (err) {
            return cb(err);
        }
        //const COLS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
        //const ROWS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        var worksheet = workbook.Sheets[workbook.SheetNames[0]];
        //var headersRowNumber = -1;
        //var cell, c, r, matches = 0;
        //for (r in ROWS) {
        //    for (c in COLS) {
        //        cell = worksheet[COLS[c] + ROWS[r]]
        //        if (cell) {
        //            if (cell.t === 'n' && (cell.v === 1 || cell.v === 2 || cell.v === 3 || cell.v === 4 || cell.v === 5 || cell.v === 6)) {
        //                matches++;
        //                if (matches >= 2) {
        //                    headersRowNumber = ROWS[r];
        //                    break;
        //                }
        //            }
        //        }
        //    }
        //    if (headersRowNumber !== -1) {
        //        break;
        //    }
        //}


        var salaries = xlsx.utils.sheet_to_json(worksheet, {range: headersRowNumber-1});

        var columnSettings = _.omit(columnSettings, function(value, key, object){
           return value===null;
        });
        salaries = salaries
            .filter(function(s){
                return s[columnSettings['מספר סוכן']];
            })
            .map(function(s){
                var obj = {};
                Object.keys(columnSettings).map(function(setting){
                    try {
                        obj[setting] = Number(s[columnSettings[setting]].replace(',', '').trim());
                    }catch(err){
                        return cb(err);
                    }
                });
            return obj;
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

                    //} else if (aName.indexOf('/') !== -1) {
                    //    nameToSplit = aName.split('/');
                    //    //if(!nameToIds[nameToSplit[0]]) {
                    //    //    nameToIds[nameToSplit[0]] = ID;
                    //    //}
                    //    len--;
                    //    if (len===1){
                    //        return cb();
                    //    }

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
                            if (!nameToIds[aName.trim()]) {
                                nameToIds[aName.trim()] = ID;
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

                    if (ID && ID.indexOf('-') === -1 && aName.indexOf('+') === -1) {
                        delete  agent.ID;
                        delete agent['סוכן'];
                        var splitName = aName.split('/')[0].split(' ');
                        _.mapObject(agent, function (aid, compName) {

                            var pd = [
                                {companyName: compName, agentNumber: aid, paymentType:'נפרעים',agentPart:70, agencyPart:30},
                                {companyName: compName, agentNumber: aid, paymentType:'בונוס',agentPart:50, agencyPart:50},
                                {companyName: compName, agentNumber: aid, paymentType:'היקף',agentPart:55, agencyPart:45}
                            ];
                            agentService.addAgent(ID, splitName[0].trim(), splitName.slice(1,splitName.length).join(' ').trim(), '', '', '', true, pd)
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
                    aName = aName.split('/')[0];
                } else if (aName.indexOf('+') !== -1) {
                    aName = aName.split('+');
                } else {
                    return;
                }
                if(agent.ID===7351 || agent.ID==='7351'){
                    console.log('7351');
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
                                partnershipPart: 70,
                                agencyPart: 30
                            });
                            pd2.push({
                                companyName: compName,
                                partnershipNumber: aid,
                                paymentType: 'בונוס',
                                partnershipPart: 50,
                                agencyPart: 50
                            });
                            pd2.push({
                                companyName: compName,
                                partnershipNumber: aid,
                                paymentType: 'היקף',
                                partnershipPart: 55,
                                agencyPart: 45
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
                                partnershipPart: 70,
                                agencyPart: 30
                            })
                            pd3.push({
                                companyName: compName,
                                partnershipNumber: aid,
                                paymentType: 'בונוס',
                                partnershipPart: 50,
                                agencyPart: 50
                            })
                            pd3.push({
                                companyName: compName,
                                partnershipNumber: aid,
                                paymentType: 'היקף',
                                partnershipPart: 55,
                                agencyPart: 45
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