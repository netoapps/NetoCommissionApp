/**
 * Created by efishtain on 27/07/2016.
 */
/**
 * Created by efishtain on 22/07/2016.
 */

var ExpansesService = require('../Services/expansesService');

var expanseService = new ExpansesService();

function addExpanseToAgentAtDate(req, res) {
    if(!req.params.idNumber){
        return res.status(400).json({err: 'missing idNumber'});
    }
    var data = req.body;
    if (!data) {
        return res.status(400).json({err: 'missing data'});
    }
    if (!data.expanseDate) {
        return res.status(400).json({err: 'missing expanseDate'});
    }
    if (!data.type) {
        return res.status(400).json({err: 'missing type'});
    }
    if (!data.sum) {
        return res.status(400).json({err: 'missing sum'});
    }
    if (!data.notes) {
        return res.status(400).json({err: 'notes'});
    }

    expanseService.addExpanseToAgentAtDate(req.params.idNumber, data.expanseDate, data.type, data.sum, data.notes)
        .then(function (expanse) {
            return res.status(200).json({expanse: expanse});
        })
        .catch(function (err) {
            return res.status(400).json({err: err});
        })
}

function deleteExpanse(req, res) {
    expanseService.deleteExpanse(req.params.expanseId)
        .then(function () {
            return res.status(200).json({msg: 'expanse deleted'});
        })
        .catch(function (err) {
            return res.status(400).json({err: err});
        })
}


function updateExpanse(req, res) {
    if(!req.params.expanseId){
        return res.status(400).json({err: 'missing expanseId'});
    }
    var data = req.body;
    if (!data) {
        return res.status(400).json({err: 'missing data'});
    }

    if (!data.expanseDate) {
        return res.status(400).json({err: 'missing expanseDate'});
    }
    if (!data.type) {
        return res.status(400).json({err: 'missing type'});
    }
    if (!data.sum) {
        return res.status(400).json({err: 'missing sum'});
    }
    if (!data.notes) {
        return res.status(400).json({err: 'notes'});
    }
    expanseService.updateExpanse(req.params.expanseId, data.expanseDate, data.type, data.sum, data.notes)
        .then(function (expanse) {
            return res.status(200).json({expanse: expanse});
        })
        .catch(function (err) {
            return res.status(400).json({err: err});
        })
}

function getAgentExpanseForDate(req, res) {
    var data = req.params;
    if(!data || !data.idNumber || !data.startDate || !data.endDate){
        return res.status(400).json({err:'missing data'});
    }
    expanseService.getAgentExpanseForDate(data.idNumber, data.startDate, data.endDate)
        .then(function (expanses) {
            return res.status(200).json({expanses: expanses});
        })
        .catch(function (err) {
            return res.status(400).json({err: err});
        })
}

module.exports = {addExpanseToAgentAtDate, updateExpanse, deleteExpanse, getAgentExpanseForDate};