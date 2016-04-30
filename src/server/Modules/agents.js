/**
 * Created by efishtain on 25/04/2016.
 */

var Agent = require('../Models/agent');

module.exports.addAgent = function (req, res) {
    if (!req.body || !req.body.agentId) {
        return res.status(400).json({msg: 'missing agentId'});
    }
    const ad = req.body;
    var agent = new Agent();
    agent._id = ad.agentId;
    agent.name = ad.name || '';
    agent.lastName = ad.lastName || '';
    agent.constantExpenses = ad.constantExpenses || 0;
    agent.salaries = [];
    agent.save(function (err) {
        if (err) {
            if(err.code ===11000){
                return res.status(400).json({msg: 'agentId already exists'});
            }else {
                return res.status(500).json({err: err});
            }
        }
        return res.status(200).json({agent: agent});
    });
};

module.exports.deleteAgent = function (req, res) {
    if (!req.params.id) {
        return res.status(400).json({msg: 'missing agentId'});
    }
    Agent.findById(req.params.id, function (err, agent) {
        if (err) {
            return res.status(500).json({err: 'internal error'});
        }
        if (!agent) {
            return res.status(200).json({msg: 'agent id was not found'});
        }
        agent.remove(function (err) {
            if (err) {
                return res.status(500).json({err: 'internal error'});
            }
            return res.status(200).json({agent: agent});
        });
    });
};

module.exports.updateAgent = function (req, res) {
    return res.status(200).json({msg: 'not yet implemented'});
};

module.exports.getAgent = function (req, res) {
    var query = {};
    if (req.params.id) {
        query.id = req.params.id;
    }
    Agent.find(query).lean().exec(function (err, agents) {
        if (err) {
            return res.status(500).json({err: 'internal error'});
        }
        return res.status(200).json({agents: agents});
    });
};

module.exports.getSalariesForDate = function (req, res) {
    if (!req.params.year || !req.params.month) {
        return res.status(400).json({msg: 'missing date'});
    }
    const year = Number(req.params.year), month = Number(req.params.month), day = req.params.day || 1;
    Agent.aggregate([
        {$unwind:'$salaries'},
        {$match:{
            'salaries.month':month,
            'salaries.year':year
        }},
        {
            $group: {
                _id: {year:'$salaries.year', month:'$salaries.month', agentId:'$_id'},
                salary: {'$sum': '$salaries.salary'}
            }
        },

    ], function (err, agents) {
        if (err) {
            return res.status(500).json({err: err});
        }
        return res.status(200).json({agents: agents});
    });
};