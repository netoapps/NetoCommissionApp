/**
 * Created by efishtain on 27/07/2016.
 */

var Expanse = require('../Models/expanse');

function ExpanseService() {
    this.addExpanseToAgentAtDate = function (idNumber, date, type, amount, notes) {
        return new Promise(function (resolve, reject) {
            var expanse = new Expanse();
            expanse.idNumber = idNumber;
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
    }
    this.updateExpanse = function (id, date, type, amount, notes) {
        return new Promise(function (resolve, reject) {
            Expanse.findById(id, function (err, expanse) {
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
    this.deleteExpanse = function(id){
        return new Promise(function(resolve, reject){
            Expanse.findById(id, function (err, expanse) {
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
    this.getAgentExpanseForDate = function(idNumber, date){
        return new Promise(function(resolve, reject){
            date = new Date(date);
            Expanse.find({idNumber:idNumber, expenseDate:date}, function(err, expenses){
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

    //this.getExpansesForIdNumberAndDate = function(idNumber, date){
    //    return new Promise(function(resolve, reject){
    //        date = new Date(date);
    //        var month = date.getMonth();
    //        var year = date.getYear();
    //        var monthStart = new Date(year, month, 1,0,0,0,0);
    //        var monthEnd = new Date(year,month+1,1,0,0,0,0);
    //        Expanse.find({idNumber:idNumber, expanseDate:{'$gte':monthStart,'$lt':monthEnd}}).lean().exec(function(err, expanses){
    //            if(err){
    //                return reject(err);
    //            }
    //            return resolve(expanses);
    //        })
    //    })
    //}
}
module.exports = ExpanseService;