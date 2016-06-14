/**
 * Created by efishtain on 25/04/2016.
 */

var Agent = require('../Models/agent');
var async = require('async');


function addAgent(req, res){
    Agent.count({agentIds:{'$in':req.body.ids}},function(err, count){
        if(count>0){
            return res.status(400).json({err:'agent id already exists'});
        }
        const data = req.body;
        var agent = new Agent();
        agent.agentIds = data.ids;
        agent.firstName = data.firstName;
        agent.lastName = data.lastName;
        agent.save(function(err){
            return res.status(200).json({agent:agent});
        })
    });
}
function editAgent(req, res){
    return res.status(500).json({err:'not implemented'});
}
function deleteAgent(req, res){
    const id = req.params.id;
    return res.status(500).json({err:'not implemented'});
}
function addPartnersAgent(req, res){
    return res.status(500).json({err:'not implemented'});
}

module.exports = {addAgent, editAgent, deleteAgent, addPartnersAgent};