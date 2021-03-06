/**
 * Created by efishtain on 25/04/2016.
 */

var Agent = require('../Models/agent');
var Partnership = require('../Models/partnership');
var async = require('async');
var _ = require('underscore');

function addAgent(req, res) {
    var data = req.body;
    if(!data || !data.idNumber){
        return res.status(400).json({err:'missing data'});
    }
    Agent.findOne({idNumber:data.idNumber}, function(err, agent){
        if(err){
            return res.status(500).json(err);
        }
        if(agent){
            if(agent.deleted){
                agent.deleted=false;
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
                        return res.status(500).json(err);
                    }
                    return res.status(200).json({msg:'agent undeleted'});
                })
            }else{
                return res.status(400).json({err:'agent with idNumber: '+data.idNumber+' already exist'});
            }
        }else{
            agent = new Agent();
            agent.name = data.name;
            agent.familyName = data.familyName;
            agent.idNumber = data.idNumber;
            agent.phoneNumber = data.phoneNumber;
            agent.faxNumber = data.faxNumber;
            agent.email =data.email;
            agent.active = data.active;
            agent.paymentsDetails = data.paymentsDetails;
            agent.deleted=false;
            agent.save(function(err){
                if(err){
                    return res.status(500).json({err:err});
                }
                return res.status(200).json({agent:agent});
            })
        }
    })

}
function editAgent(req, res) {
    const agentId = req.params.agentId;
    if (!agentId){
        return res.status(400).json({err:'missing agent id'});
    }
    Agent.findOne({_id:agentId}, function(err, agent){
        if(err){
            return res.status(500).json({err:err});
        }
        if(!agent){
            return res.status(400).json({err:'agent does not exist'});
        }
        if(agent.deleted){
            return res.status(400).json({err:'agent is deleted'});
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
        agent.deleted=false;
        agent.save(function(err){
            if(err){
                return res.status(500).json({err:err});
            }
            return res.status(200).json({agent:agent});
        })
    })
}

function deleteAgent(req, res) {
    const agentId = req.params.agentId;
    if (!agentId){
        return res.status(400).json({err:'missing agent id'});
    }
    Agent.findOne({_id:agentId}, function(err, agent){
        if(err){
            return res.status(500).json({err:err});
        }
        if(!agent){
            return res.status(400).json({err:'agent not found'});
        }
        if(agent.deleted){
            return res.status(400).json({err:'agent already deleted'});
        }
        agent.deleted=true;
        agent.save(function(err){
            if(err){
                return res.status(500).json({err:err});
            }
            return res.status(200).json({msg:'delete succeed'});
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
        return res.status(200).json({partnership:partnership});
    })
}

function editPartnership(req, res) {
    const partnershipId = req.params.partnershipId;
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
            return res.status(200).json({partnership:partnership});
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
            return res.status(200).json({msg:'delete succeed'});
        })
    });
}


function getAllPartnerships(req, res){
    Partnership.find({}, function(err, partnerships){
        if(err){
            return res.status(500).json({err:err});
        }
        return res.status(200).json({partnerships:partnerships});
    })
}

function getAllAgents(req,res){

    Agent.find({},function(err,agents){
        if(err){
            return res.status(500).json({err:err});
        }
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

function getPartnershipById(req, res){
    const partnershipId = req.params.partnershipId;
    Partnership.findOne({_id:partnershipId}, function(err, partnership){
        if(err){
            return res.status(500).json({err:err});
        }
        return res.status(200).json({partnership:partnership});
    })
}
module.exports = {
    addAgent, editAgent, deleteAgent,
    addPartnership,editPartnership,deletePartnership,
    getAllAgents,getAllPartnerships,
    getAgentById,getPartnershipById
};