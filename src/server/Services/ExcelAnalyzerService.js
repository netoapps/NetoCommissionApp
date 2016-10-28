/**
 * Created by efishtain on 19/05/2016.
 */
var xlsx = require('xlsx');
var AgentsService = require('./agentsService');
var _ = require('underscore');
var async = require('async');
var sha1 = require('sha1')

function ExcelAnalyzerService() {
    this.analyzeSalaryFile = function (filePath, columnSettings, headersRowNumber, cb) {
        try {
            var workbook = xlsx.readFile(filePath);
        } catch (err) {
            return cb(err);
        }

        var worksheet = workbook.Sheets[workbook.SheetNames[0]];
        var salaries = xlsx.utils.sheet_to_json(worksheet, {range: headersRowNumber - 1});
        columnSettings = _.omit(columnSettings, function (value, key, object) {
            return value === null;
        });
        salaries = salaries
            .filter(function (s) {
                return s[columnSettings['מספר סוכן']];
            })
            .map(function (s) {
                var obj = {};
                Object.keys(columnSettings).map(function (setting) {
                    try {
                        if (setting == 'מספר סוכן') {
                            if (isNaN(s[columnSettings[setting]])) {
                                obj[setting] = s[columnSettings[setting]].trim();
                            } else {
                                obj[setting] = Number(s[columnSettings[setting]]);
                            }
                        } else {
                            if (s[columnSettings[setting]] != null) {
                                obj[setting] = Number(s[columnSettings[setting]].replace(/,/g, '').trim());
                            }
                        }
                    } catch (err) {
                        return cb(err);
                    }
                });
                return obj;
            });

        return cb(null, salaries);

    };
    this.analyzeColumns = function (filePath, cb) {
        try {
            var workbook = xlsx.readFile(filePath);
        } catch (err) {
            return cb(err);
        }

        var sheet = workbook.Sheets[workbook.SheetNames[0]];
        var cols = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
            'AA', 'AB', 'AC', 'AD', 'AE', 'AF', 'AG', 'AH', 'AI', 'AJ', 'AK', 'AL', 'AM', 'AN', 'AO', 'AP', 'AQ', 'AR', 'AS', 'AT', 'AU', 'AV', 'AW', 'AX', 'AY', 'AZ',
            'BA', 'BB', 'BC', 'BD', 'BE', 'BF', 'BG', 'BH', 'BI', 'BJ', 'BK', 'BL', 'BM', 'BN', 'BO', 'BP', 'BQ', 'BR', 'BS', 'BT', 'BU', 'BV', 'BW', 'BX', 'BY', 'BZ',
            'CA', 'CB', 'CC', 'CD', 'CE', 'CF', 'CG', 'CH', 'CI', 'CJ', 'CK', 'CL', 'CM', 'CN', 'CO', 'CP', 'CQ', 'CR', 'CS', 'CT', 'CU', 'CV', 'CW', 'CX', 'CY', 'CZ'];
        var rows = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        var headersRow = -1;
        var stopExecution = false;
        var headers = [];
        rows.forEach(function (row) {
            if (!stopExecution) {
                cols.forEach(function (col) {
                    if (sheet[col + row] !== undefined && sheet[col + row] !== '!' && sheet[col + row].v) {
                        headersRow = row;
                        headers.push(sheet[col + row].v);
                        stopExecution = true;
                    }
                })
            }
        })

        //var salaries = xlsx.utils.sheet_to_json(sheet, {range: headersRow-1});
        if (headersRow !== -1) {
            return cb(null, {
                headers: headers,
                dataRowNumber: headersRow
            });
        } else {
            return cb('could not find headers');
        }

    }
    this.analyzeAgentsFileNew = function (filePath, cb) {
        try {
            var workbook = xlsx.readFile(filePath);
        } catch (err) {
            return cb(err);
        }
        var agentService = new AgentsService();
        var worksheet = workbook.Sheets[workbook.SheetNames[0]];

        const data = xlsx.utils.sheet_to_json(worksheet);
        const validData = _.partition(data, function (a) {
            return a['סוכן'].indexOf('+') === -1
        })
        const agents = validData[0]
        const partnerships = _.groupBy(validData[1], 'סוכן')

        const nameToIds = agents
            .filter(function (agent) {
                return agent['ID']
            })
            .reduce(function (accum, agent) {
                var name = agent['סוכן'].split('/');
                var ID = agent['ID'].trim();
                accum[name[0]] = ID;
                return accum;
            }, {})

        const agentsActions = agents
            .reduce(function (actions, agent) {
                var splitName = agent['סוכן'].split('/')[0].split(' ')
                var ID = agent['ID'].trim()
                var pds = Object.keys(agent)
                    .filter(function (property) {
                        return property !== 'ID' && property !== 'סוכן'
                    })
                    .reduce(function (pds, company) {
                        const pd = [
                            {
                                companyName: company,
                                agentNumber: agent[company],
                                paymentType: 'נפרעים',
                                agentPart: 70,
                                agencyPart: 30
                            },
                            {
                                companyName: company,
                                agentNumber: agent[company],
                                paymentType: 'בונוס',
                                agentPart: 50,
                                agencyPart: 50
                            },
                            {
                                companyName: company,
                                agentNumber: agent[company],
                                paymentType: 'היקף',
                                agentPart: 55,
                                agencyPart: 45
                            }
                        ]
                        return pds.concat(pd)

                    }, [])
                if (pds.length > 0) {
                    actions.push(agentService.addAgent(ID, splitName[0].trim(), splitName.slice(1, splitName.length).join(' ').trim(), '', '', '', true, pds))
                } else {
                    actions.push(agentService.addAgent(ID, splitName[0].trim(), splitName.slice(1, splitName.length).join(' ').trim(), '', '', '', true, []))
                }
                return actions
            }, [])
        var pActions = []
        for (var key in partnerships) {
            var partnershipsArray = partnerships[key]
            var ids = partnershipsArray[0]['סוכן'].split('+').map(function (name) {
                return nameToIds[name]
            }).filter(function (id) {
                return !isNaN(id)
            })
            var agentsDetails;
            if (ids.length === 2) {
                agentsDetails = [{idNumber: ids[0], part: 50}, {idNumber: ids[1], part: 50}];
            } else if (ids.length === 3) {
                agentsDetails = [{idNumber: ids[0], part: 33}, {idNumber: ids[1], part: 33}, {
                    idNumber: ids[2],
                    part: 34
                }];
            } else {
                continue
            }
            var pds = partnershipsArray.reduce(function (allGroupPds, entity) {
                const pd =
                    Object.keys(entity).filter(function (key) {
                        return key !== 'ID' && key !== 'סוכן'
                    }).reduce(function (allPds, company) {
                        const compPd = [
                            {
                                companyName: company,
                                partnershipNumber: entity[company],
                                paymentType: 'נפרעים',
                                partnershipPart: 70,
                                agencyPart: 30
                            },
                            {
                                companyName: company,
                                partnershipNumber: entity[company],
                                paymentType: 'בונוס',
                                partnershipPart: 50,
                                agencyPart: 50
                            },
                            {
                                companyName: company,
                                partnershipNumber: entity[company],
                                paymentType: 'היקף',
                                partnershipPart: 55,
                                agencyPart: 45
                            }
                        ]
                        return allPds.concat(compPd)
                    }, [])

                return allGroupPds.concat(pd)
            }, [])
            pActions.push(agentService.addPartnership(agentsDetails, true, pds))
        }


        const actions = agentsActions.concat(pActions);
        Promise.all(actions)
            .then(function () {
                return cb(null)
            })
            .catch(function (err) {
                return cb(err)
            })
    }
    //this.analyzeAgentsFile = function (filePath, cb) {
    //    try {
    //        var workbook = xlsx.readFile(filePath);
    //    } catch (err) {
    //        return cb(err);
    //    }
    //    var agentService = new AgentsService();
    //    var worksheet = workbook.Sheets[workbook.SheetNames[0]];
    //
    //    var agents = xlsx.utils.sheet_to_json(worksheet);
    //    var nameToIds = {};
    //    var len = agents.length;
    //    async.series([
    //        function (cb) {
    //            _.map(agents, function (agent) {
    //                var aName = agent['סוכן'];
    //                var ID = agent.ID;
    //                var nameToSplit;
    //                if (aName.indexOf('-') !== -1) {
    //                    nameToSplit = aName.split('-');
    //                    //if(!nameToIds[nameToSplit[0]]) {
    //                    //    nameToIds[nameToSplit[0]] = ID;
    //                    //}
    //                    len--;
    //                    if (len===1){
    //                        return cb();
    //                    }
    //
    //                //} else if (aName.indexOf('/') !== -1) {
    //                //    nameToSplit = aName.split('/');
    //                //    //if(!nameToIds[nameToSplit[0]]) {
    //                //    //    nameToIds[nameToSplit[0]] = ID;
    //                //    //}
    //                //    len--;
    //                //    if (len===1){
    //                //        return cb();
    //                //    }
    //
    //                } else if (aName.indexOf('+') !== -1) {
    //                    nameToSplit = aName.split('+');
    //                    //if(!nameToIds[nameToSplit[0]]) {
    //                    //    nameToIds[nameToSplit[0]] = ID;
    //                    //}
    //                    len--;
    //                    if (len===1){
    //                        return cb();
    //                    }
    //                } else {
    //                        if (!nameToIds[aName.trim()]) {
    //                            nameToIds[aName.trim()] = ID;
    //                        }
    //                }
    //
    //
    //
    //                //if(nameToSplit!=null){
    //                //    if (!nameToIds[nameToSplit[0]]) {
    //                //        nameToIds[nameToSplit[0]] = ID;
    //                //    }
    //                //}else{
    //                //    if (!nameToIds[aName]) {
    //                //        nameToIds[aName] = ID;
    //                //    }
    //                //}
    //
    //                if (ID && aName.indexOf('+') === -1) {
    //                    delete  agent.ID;
    //                    delete agent['סוכן'];
    //                    var splitName = aName.split('/')[0].split(' ');
    //                    var pd=[];
    //                    if(Object.keys(agent).length>0) {
    //                        _.mapObject(agent, function (aid, compName) {
    //
    //                            pd = [
    //                                {
    //                                    companyName: compName,
    //                                    agentNumber: aid,
    //                                    paymentType: 'נפרעים',
    //                                    agentPart: 70,
    //                                    agencyPart: 30
    //                                },
    //                                {
    //                                    companyName: compName,
    //                                    agentNumber: aid,
    //                                    paymentType: 'בונוס',
    //                                    agentPart: 50,
    //                                    agencyPart: 50
    //                                },
    //                                {
    //                                    companyName: compName,
    //                                    agentNumber: aid,
    //                                    paymentType: 'היקף',
    //                                    agentPart: 55,
    //                                    agencyPart: 45
    //                                }
    //                            ];
    //                            agentService.addAgent(ID, splitName[0].trim(), splitName.slice(1, splitName.length).join(' ').trim(), '', '', '', true, pd)
    //                                .then(function () {
    //                                    console.log('created agent ' + ID);
    //                                    len--;
    //                                    if (len === 1) {
    //                                        return cb();
    //                                    }
    //                                })
    //                                .catch(function () {
    //                                    console.log('ID ' + ID + ' already in system');
    //                                    len--;
    //                                    if (len === 1) {
    //                                        return cb();
    //                                    }
    //                                })
    //                        });
    //                    }else{
    //                        agentService.addAgent(ID, splitName[0].trim(), splitName.slice(1, splitName.length).join(' ').trim(), '', '', '', true, pd)
    //                            .then(function () {
    //                                console.log('created agent ' + ID);
    //                                len--;
    //                                if (len === 1) {
    //                                    return cb();
    //                                }
    //                            })
    //                            .catch(function () {
    //                                console.log('ID ' + ID + ' already in system');
    //                                len--;
    //                                if (len === 1) {
    //                                    return cb();
    //                                }
    //                            })
    //                    }
    //                }
    //            });
    //        }
    //    ], function (err) {
    //        _.map(agents, function (agent) {
    //            var aName = agent['סוכן'];
    //            if (!aName) {
    //                return;
    //            }
    //            if (aName.indexOf('-') !== -1) {
    //                aName = aName.split('-');
    //            } else if (aName.indexOf('/') !== -1) {
    //                aName = aName.split('/')[0];
    //            } else if (aName.indexOf('+') !== -1) {
    //                aName = aName.split('+');
    //            } else {
    //                return;
    //            }
    //
    //            delete  agent.ID;
    //            delete agent['סוכן'];
    //
    //            var firstAgent, firstAgentId, secondAgent, secondAgentId, thirdAgent, thirdAgentId;
    //            var agentsDetails;
    //            if(aName.length===2){
    //                firstAgent = aName[0];
    //                firstAgentId = nameToIds[firstAgent];
    //                secondAgent = aName[1];
    //                secondAgentId = nameToIds[secondAgent];
    //                if (firstAgent && firstAgentId && secondAgent && secondAgentId) {
    //                    agentsDetails = [{idNumber: firstAgentId, part: 50}, {idNumber: secondAgentId, part: 50}];
    //                    var pd2 = [];
    //                    _.mapObject(agent, function (aid, compName) {
    //                        pd2.push({
    //                            companyName: compName,
    //                            partnershipNumber: aid,
    //                            paymentType: 'נפרעים',
    //                            partnershipPart: 70,
    //                            agencyPart: 30
    //                        });
    //                        pd2.push({
    //                            companyName: compName,
    //                            partnershipNumber: aid,
    //                            paymentType: 'בונוס',
    //                            partnershipPart: 50,
    //                            agencyPart: 50
    //                        });
    //                        pd2.push({
    //                            companyName: compName,
    //                            partnershipNumber: aid,
    //                            paymentType: 'היקף',
    //                            partnershipPart: 55,
    //                            agencyPart: 45
    //                        });
    //                    })
    //                    agentService.addPartnership(agentsDetails, true, pd2)
    //                        .then(function () {
    //                            console.log('created partnership ' + aid);
    //                        })
    //                        .catch(function () {
    //                            console.log('ID ' + ait + ' already in system');
    //                        })
    //                }
    //            }else if(aName.length===3){
    //                firstAgent = aName[0];
    //                firstAgentId = nameToIds[firstAgent];
    //                secondAgent = aName[1];
    //                secondAgentId = nameToIds[secondAgent];
    //                thirdAgent = aName[2];
    //                thirdAgentId = nameToIds[thirdAgent];
    //                if (firstAgent && firstAgentId && secondAgent && secondAgentId && thirdAgent && thirdAgentId) {
    //                    agentsDetails = [{idNumber: firstAgentId, part: 33}, {idNumber: secondAgentId, part: 33},{idNumber:thirdAgentId,part:34}];
    //                     var pd3 =[];
    //                    _.mapObject(agent, function (aid, compName) {
    //                        pd3.push({
    //                            companyName: compName,
    //                            partnershipNumber: aid,
    //                            paymentType: 'נפרעים',
    //                            partnershipPart: 70,
    //                            agencyPart: 30
    //                        })
    //                        pd3.push({
    //                            companyName: compName,
    //                            partnershipNumber: aid,
    //                            paymentType: 'בונוס',
    //                            partnershipPart: 50,
    //                            agencyPart: 50
    //                        })
    //                        pd3.push({
    //                            companyName: compName,
    //                            partnershipNumber: aid,
    //                            paymentType: 'היקף',
    //                            partnershipPart: 55,
    //                            agencyPart: 45
    //                        })
    //                    })
    //                    agentService.addPartnership(agentsDetails, true, pd3)
    //                        .then(function () {
    //                            console.log('created partnership ' + aid);
    //                        })
    //                        .catch(function () {
    //                            console.log('ID ' + ait + ' already in system');
    //                        })
    //                }
    //            }
    //
    //            console.log('done');
    //        })
    //    })
    //
    //
    //}


    this.analyzeAgentsIdsFile = function (filePath, cb) {
        try {
            var workbook = xlsx.readFile(filePath);
        } catch (err) {
            return cb(err);
        }
        const headersRowNumber = 2
        var worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = xlsx.utils.sheet_to_json(worksheet, {range: headersRowNumber - 1})
        var agentService = new AgentsService();
        var agents = data.map(function (agent) {
                var fullname = agent['סוכן'].split(' ')
                var firstname = fullname[0].trim()
                fullname.splice(0, 1)
                var lastname = fullname.join(' ').trim()
                return {ID: agent.ID, firstname: firstname, lastName: lastname}
            })
            .reduce(function (all, agent) {
                if (!all[agent.ID]) {
                    all[agent.ID] = agent
                    return all
                }
                var prevAgent = all[agent.ID]

                if (prevAgent.firstname !== agent.firstname || prevAgent.lastName !== agent.lastName) {
                    throw 'problem with the file, agent defined twice: ' + JSON.stringify(agent)
                }
                return all
            }, {})
        var tasks = Object.keys(agents).map(function (id) {
            var agent = agents[id]
            return agentService.createBasicAgent.bind(null, agent.ID, agent.firstname, agent.lastName)
        })

        async.series(tasks,
            function (err, result) {
                if (err) {
                    return cb(err)
                }
                return cb(null)
            })

    }

    this.analyzeAgentNumbersFile = function (company, filePath, cb) {
        try {
            var workbook = xlsx.readFile(filePath);
        } catch (err) {
            return cb(err);
        }
        const headersRowNumber = 1
        var worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = xlsx.utils.sheet_to_json(worksheet, {range: headersRowNumber - 1})
        var agentService = new AgentsService();
        agentService.getAllAgents()
            .then(function (agents) {

                const nameToIdMapping = agents.map(function (agent) {
                    var fullname = (agent.name + ' ' + agent.familyName).trim()

                    return {idNumber: agent.idNumber, name: fullname}
                }).reduce(function (all, agent) {
                    all[agent.name.trim()] = agent.idNumber.trim()
                    return all
                }, {})

                var agentsTasks = data.filter(function (agent) {
                    return agent.FullName.indexOf('+') === -1
                }).map(function (agent) {
                    if (!nameToIdMapping[agent.FullName.trim()]) {
                        throw 'invalid agent found: ' + JSON.stringify(agent)
                    }
                    var pd = [
                        {
                            companyName: company,
                            agentNumber: agent.AgentNumber,
                            paymentType: 'נפרעים',
                            agentPart: 70,
                            agencyPart: 30
                        },
                        {
                            companyName: company,
                            agentNumber: agent.AgentNumber,
                            paymentType: 'בונוס',
                            agentPart: 50,
                            agencyPart: 50
                        },
                        {
                            companyName: company,
                            agentNumber: agent.AgentNumber,
                            paymentType: 'היקף',
                            agentPart: 55,
                            agencyPart: 45
                        }
                    ]
                    return {idNumber: nameToIdMapping[agent.FullName], pd: pd}
                }).reduce(function (all, agent) {
                    all.push(agentService.addAgentPaymentDetails.bind(null, agent.idNumber, agent.pd))
                    return all
                }, [])

                var partnershipsTasks = data.filter(function (agent) {
                    return agent.FullName.indexOf('+') !== -1
                }).map(function (agent) {
                    var agentsNames = agent.FullName.split('+')
                    var agentsDetails = agentsNames.map(function (name, index) {
                        if (!nameToIdMapping[name.trim()]) {
                            throw 'invalid agent: ' + name
                        }
                        if (agentsNames.length === 2) {
                            return {idNumber: nameToIdMapping[name], part: 50}
                        } else {
                            if (index === 2) {
                                return {idNumber: nameToIdMapping[name], part: 34}
                            } else {
                                return {idNumber: nameToIdMapping[name], part: 33}
                            }
                        }
                    })
                    var compPd = [
                        {
                            companyName: company,
                            partnershipNumber: agent.AgentNumber,
                            paymentType: 'נפרעים',
                            partnershipPart: 70,
                            agencyPart: 30
                        },
                        {
                            companyName: company,
                            partnershipNumber: agent.AgentNumber,
                            paymentType: 'בונוס',
                            partnershipPart: 50,
                            agencyPart: 50
                        },
                        {
                            companyName: company,
                            partnershipNumber: agent.AgentNumber,
                            paymentType: 'היקף',
                            partnershipPart: 55,
                            agencyPart: 45
                        }
                    ]
                    var sortedIds = agentsDetails.map(function (a) {
                        return a.idNumber
                    }).sort()
                    var hash = sha1(sortedIds)
                    return agentService.addPartnershipDetails.bind(null, agentsDetails, true, compPd, hash)
                })
                async.series(agentsTasks.concat(partnershipsTasks),
                    function (err, result) {
                        if (err) {
                            return cb(err)
                        }
                        return cb()
                    })
            })


            .catch(function (err) {
                return cb(err)
            })
    }


    this.analyzeMissingNamesInFile = function (filePath, sheetNumber, cb) {
        try {
            var workbook = xlsx.readFile(filePath);
        } catch (err) {
            return cb(err);
        }
        const headersRowNumber = 1
        var worksheet = workbook.Sheets[workbook.SheetNames[sheetNumber]];
        const data = xlsx.utils.sheet_to_json(worksheet, {range: headersRowNumber - 1})
        var agentService = new AgentsService();
        agentService.getAllAgents()
            .then(function (agents) {

                const nameToIdMapping = agents.map(function (agent) {
                    var fullname = (agent.name + ' ' + agent.familyName).trim()

                    return {idNumber: agent.idNumber, name: fullname}
                }).reduce(function (all, agent) {
                    all[agent.name.trim()] = agent.idNumber.trim()
                    return all
                }, {})

                var missingNames = data.filter(function (agent) {
                        return agent.FullName.indexOf('+') === -1
                    })
                    .reduce(function (all, a) {
                        if (!nameToIdMapping[a.FullName.trim()]) {
                            all.push(a.FullName)
                        }
                        return all
                    }, [])


                var missingNames2 = data.filter(function (agent) {
                    return agent.FullName.indexOf('+') !== -1
                }).reduce(function (missing, agents) {
                    var agentsNames = agents.FullName.split('+')
                    var miss = agentsNames.reduce(function (all, name) {
                        if (!nameToIdMapping[name.trim()]) {
                            all.push(name)
                        }
                       return all
                    },[])
                    missing = missing.concat(miss)
                    return missing
                },[])
                console.log(missingNames.concat(missingNames2))
            })


            .catch(function (err) {
                return cb(err)
            })
    }
}


module.exports = ExcelAnalyzerService;