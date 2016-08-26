/**
 * Created by efishtain on 27/07/2016.
 */

var Expense = require('../Models/expanse');
var Partnership = require('../Models/partnership');
function ExpanseService() {
     function addExpanseToAgentAtDate(idNumber, date, type, amount, notes, partnershipExpenseId) {
        return new Promise(function (resolve, reject) {
            var expense = new Expense();
            expense.idNumber = idNumber;
            expense.expenseDate = date;
            expense.type = type;
            expense.amount = amount;
            expense.notes = notes;
            expense.partnershipExpenseId = partnershipExpenseId || null;
            expense.owner = 'agent';
            expense.save(function (err) {
                if (err) {
                    return reject(err);
                }
                return resolve(expense);
            })

        })
    }

    function addExpanseToPartnershipAtDate(pid, date, type, amount, notes) {
        return new Promise(function (resolve, reject) {
            var expense = new Expense();
            expense.idNumber = pid;
            expense.expenseDate = date;
            expense.type = type;
            expense.amount = amount;
            expense.notes = notes;
            expense.partnershipExpenseId = null;
            expense.owner = 'partnership';
            expense.save(function (err) {
                if (err) {
                    return reject(err);
                }
                var expensesList = [];
                Partnership.findById(pid).lean().exec(function(err, partnership){
                    if(err){
                        expense.remove(function(error){
                            return reject(err);
                        });
                    }else if(!partnership){
                        expense.remove(function(error){
                            return reject('partnership id not exist: '+pid);
                        });
                    }else{
                        partnership.agentsDetails.forEach(function(agent){
                            var calculatedAmount = amount*Number(agent.part)/100;
                            expensesList.push(addExpanseToAgentAtDate(agent.idNumber,date,type,calculatedAmount,notes, expense._id));
                        });
                        Promise.all(expensesList)
                            .then(function(){
                                return resolve(expense);
                            })
                            .catch(reject)

                    }
                })
            })

        })
    }


    this.updateExpanse = function (id, date, type, amount, notes) {
        return new Promise(function (resolve, reject) {
            Expense.findById(id, function (err, expanse) {
                if (err) {
                    return reject(err);
                }
                if (!expanse) {
                    return reject('expanse not found');
                }
                expanse.expenseDate = date;
                expanse.type = type;
                expanse.amount = amount;
                expanse.notes = notes;
                expanse.save(function (err) {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(expanse);
                })

            })
        })
    }
    this.updatePartnershipExpense = function(expenseId,pid, date, type, amount, notes){
        return new Promise(function(resolve, reject){
            deletePartnershipExpense(expenseId)
                .then(addExpanseToPartnershipAtDate.bind(null, pid, date,type,amount,notes))
                .then(function(expense){
                    return resolve(expense)
                })
                .catch(function(err){
                    return reject(err);
                })
        })

    }
    this.deleteExpanse = function(id){
        return new Promise(function(resolve, reject){
            Expense.findById(id, function (err, expanse) {
                if (err) {
                    return reject(err);
                }
                if (!expanse) {
                    return reject('expanse not found');
                }

                expanse.remove(function (err) {
                    if (err) {
                        return reject(err);
                    }
                    return resolve();
                })

            })
        })
    }
    function deletePartnershipExpense(id){
        return new Promise(function(resolve, reject){
            Expense.remove({_id:id, owner:'partnership'}, function(err){
                if(err){
                    return reject(err);
                }
                Expense.remove({partnershipExpenseId:id}, function(err){
                    if(err){
                        return reject(err);
                    }
                    return resolve();
                })
            })
        })
    }
    this.getExpensesForDate = function(idNumber, date, owner){
        return new Promise(function(resolve, reject){
            date = new Date(date);
            Expense.find({idNumber:idNumber, expenseDate:date, owner}, function(err, expenses){
                if (err) {
                    return reject(err);
                }
                if (!expenses) {
                    return reject('expanse not found');
                }
                return resolve(expenses);

            })
        })
    }

    this.addExpanseToAgentAtDate =addExpanseToAgentAtDate;
    this.addExpanseToPartnershipAtDate = addExpanseToPartnershipAtDate;
    this.deletePartnershipExpense =  deletePartnershipExpense;

}
module.exports = ExpanseService;