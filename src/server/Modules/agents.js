/**
 * Created by efishtain on 25/04/2016.
 */

var Agent = require('../Models/agent');
var Partnership = require('../Models/partnership');
var async = require('async');
var _ = require('underscore');

function addAgent(req, res) {
    var agent = new Agent();
    var data = req.body.agent;
    agent.name = data.name;
    agent.familyName = data.familyName;
    agent.idNumber = data.idNumber;
    agent.phoneNumber = data.phoneNumber;
    agent.faxNumber = data.faxNumber;
    agent.email =data.email;
    agent.active = data.active;
    agent.paymentsDetails = data.paymentsDetails;
    agent.save(function(err){
        if(err){
            return res.status(500).json({err:err});
        }
        return res.status(200);
    })
}
function editAgent(req, res) {
    const agentId = req.params.agentId;
    if (!agentId){
        return res.status(400).json({err:'missing agent id'});
    }
    Agent.findOne({idNumber:agentId}, function(err, agent){
        if(err){
            return res.status(500).json({err:err});
        }
        var data = req.body;
        agent.name = data.name;
        agent.familyName = data.familyName;
        agent.idNumber = data.idNumber;
        agent.phoneNumber = data.phoneNumber;
        agent.faxNumber = data.faxNumber;
        agent.email =data.email;
        agent.active = data.active;
        agent.paymentsDetails = data.paymentsDetails;
        agent.updateTime = Date.now();
        agent.save(function(err){
            if(err){
                return res.status(500).json({err:err});
            }
            return res.status(200);
        })
    })
}

function deleteAgent(req, res) {
    const agentId = req.params.agentId;
    if (!agentId){
        return res.status(400).json({err:'missing agent id'});
    }
    Agent.findOne({idNumber:agentId}, function(err, agent){
        if(err){
            return res.status(500).json({err:err});
        }
        agent.remove(function(err){
            if(err){
                return res.status(500).json({err:err});
            }
            return res.status(200);
        })
    });
}

function addPartnership(req, res) {
    var partnership = new Partnership();
    var data = req.body;
    partnership.agentsDetails =data.agentsDetails;
    partnership.active = data.active;
    partnership.paymentsDetails = data.paymentsDetails;
    partnership.save(function(err){
        if(err){
            return res.status(500).json({err:err});
        }
        return res.status(200);
    })
}

function editPartnership(req, res) {
    const partnershipId = req.params.agentId;
    if (!partnershipId){
        return res.status(400).json({err:'missing partnership id'});
    }
    Partnership.findOne({_id:partnershipId}, function(err, partnership){
        if(err){
            return res.status(500).json({err:err});
        }
        var data = req.body;
        partnership.agentsDetails =data.agentsDetails;
        partnership.active = data.active;
        partnership.paymentsDetails = data.paymentsDetails;
        partnership.save(function(err){
            if(err){
                return res.status(500).json({err:err});
            }
            return res.status(200);
        })
    })
}
function deletePartnership(req, res) {
    const partnershipId = req.params.partnershipId;
    if (!partnershipId){
        return res.status(400).json({err:'missing agent id'});
    }
    Partnership.findOne({_id:partnershipId}, function(err, partnership){
        if(err){
            return res.status(500).json({err:err});
        }
        partnership.remove(function(err){
            if(err){
                return res.status(500).json({err:err});
            }
            return res.status(200);
        })
    });
}


function getAllPartnerships(req, res){
    Partnership.find({}, function(err, partnerships){
        return res.status(200).json({partnerships:partnerships});
    })
}

function getAllAgents(req,res){

    Agent.find({},function(err,agents){
        agents = _.groupBy(agents,function(a){
            return a.idNumber;
        });

        return res.status(200).json({agents:agents});
    })
}


function getAgentById(req, res){
    const agentId = req.params.idNumber;
    Agent.findOne({idNumber:agentId}, function(err, agent){
        if(err){
            return res.status(500).json({err:err});
        }
        return res.status(200).json({agent:agent});
    })
}
module.exports = {addAgent, editAgent, deleteAgent, addPartnership,editPartnership,deletePartnership,getAllAgents,getAllPartnerships,getAgentById};