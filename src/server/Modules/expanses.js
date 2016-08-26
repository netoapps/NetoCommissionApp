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
    if (!data.expenseDate) {
        return res.status(400).json({err: 'missing expanseDate'});
    }

    if (!data.amount) {
        return res.status(400).json({err: 'missing amount'});
    }


    var repeatCount = data.repeat || 1;
    var expensesRequests = [];
    var startDate = new Date(data.expenseDate);

    for(var i=0;i<repeatCount;i++){
        expensesRequests.push(expanseService.addExpanseToAgentAtDate(req.params.idNumber, startDate.toISOString(), data.type, data.amount, data.notes, null));
        startDate.setMonth(startDate.getMonth()+1);
    }
    Promise.all(expensesRequests)
        .then(function (expenses) {
            var expense = expenses.filter(function(e){
                return e.expenseDate.toISOString() === data.expenseDate;
            });
            return res.status(200).json({expense: expense.length == 0 ? null:expense[0]});
        })
        .catch(function (err) {
            return res.status(400).json({err: err});
        })

}

function addExpanseToPartnershipAtDate(req, res) {
    if(!req.params.pid){
        return res.status(400).json({err: 'missing pid'});
    }
    var data = req.body;
    if (!data) {
        return res.status(400).json({err: 'missing data'});
    }
    if (!data.expenseDate) {
        return res.status(400).json({err: 'missing expanseDate'});
    }
    
    if (!data.amount) {
        return res.status(400).json({err: 'missing amount'});
    }

    var repeatCount = data.repeat || 1;
    var expensesRequests = [];
    var startDate = new Date(data.expenseDate);

    for(var i=0;i<repeatCount;i++){
        expensesRequests.push(expanseService.addExpanseToPartnershipAtDate(req.params.pid, startDate.toISOString(), data.type, data.amount, data.notes));
        startDate.setMonth(startDate.getMonth()+1);
    }
    Promise.all(expensesRequests)
        .then(function (expenses) {
            var expense = expenses.filter(function(e){
                return e.expenseDate.toISOString() === data.expenseDate;
            });
            return res.status(200).json({expense: expense.length == 0 ? null:expense[0]});
        })
        .catch(function (err) {
            return res.status(400).json({err: err});
        });
}

function deleteExpanse(req, res) {
    expanseService.deleteExpanse(req.params.expenseId)
        .then(function () {
            return res.status(200).json({msg: 'expense deleted'});
        })
        .catch(function (err) {
            return res.status(400).json({err: err});
        })
}

function deletePartnershipExpense(req, res) {
    expanseService.deletePartnershipExpense(req.params.expenseId)
        .then(function () {
            return res.status(200).json({msg: 'expense deleted'});
        })
        .catch(function (err) {
            return res.status(400).json({err: err});
        })
}



function updateExpanse(req, res) {
    if(!req.params.expenseId){
        return res.status(400).json({err: 'missing expanseId'});
    }
    var data = req.body;
    if (!data) {
        return res.status(400).json({err: 'missing data'});
    }

    if (!data.expenseDate) {
        return res.status(400).json({err: 'missing expanseDate'});
    }
    if (!data.type) {
        return res.status(400).json({err: 'missing type'});
    }
    if (!data.amount) {
        return res.status(400).json({err: 'missing amount'});
    }

    expanseService.updateExpanse(req.params.expenseId, data.expenseDate, data.type, data.amount, data.notes)
        .then(function (expense) {
            return res.status(200).json({expense: expense});
        })
        .catch(function (err) {
            return res.status(400).json({err: err});
        })
}

function updatePartnershipExpense(req, res) {
    if(!req.params.pid){
        return res.status(400).json({err: 'missing pid'});
    }
    if(!req.params.expenseId){
        return res.status(400).json({err: 'missing expanseId'});
    }
    var data = req.body;
    if (!data) {
        return res.status(400).json({err: 'missing data'});
    }

    if (!data.expenseDate) {
        return res.status(400).json({err: 'missing expanseDate'});
    }
    if (!data.type) {
        return res.status(400).json({err: 'missing type'});
    }
    if (!data.amount) {
        return res.status(400).json({err: 'missing amount'});
    }

    expanseService.updatePartnershipExpense(req.params.expenseId,req.params.pid, data.expenseDate, data.type, data.amount, data.notes)
        .then(function (expense) {
            return res.status(200).json({expense: expense});
        })
        .catch(function (err) {
            return res.status(400).json({err: err});
        })
}



function getAgentExpanseForDate(req, res) {
    var data = req.params;
    if(!data || !data.idNumber || !data.paymentDate){
        return res.status(400).json({err:'missing data'});
    }
    expanseService.getExpensesForDate(data.idNumber, data.paymentDate, 'agent')
        .then(function (expenses) {
            return res.status(200).json({expenses: expenses});
        })
        .catch(function (err) {
            return res.status(400).json({err: err});
        })
}

function getPartnershipExpanseForDate(req, res) {
    if(!req.params.pid){
        return res.status(400).json({err:'invalid pid'});
    }
    var data = req.params;
    if(!data || !data.paymentDate){
        return res.status(400).json({err:'missing data'});
    }
    expanseService.getExpensesForDate(req.params.pid, data.paymentDate, 'partnership')
        .then(function (expenses) {
            return res.status(200).json({expenses: expenses});
        })
        .catch(function (err) {
            return res.status(400).json({err: err});
        })
}

module.exports = {addExpanseToAgentAtDate, updateExpanse, deleteExpanse, getAgentExpanseForDate,
    addExpanseToPartnershipAtDate,updatePartnershipExpense, deletePartnershipExpense, getPartnershipExpanseForDate};