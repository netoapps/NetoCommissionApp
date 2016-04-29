/**
 * Created by efishtain on 25/04/2016.
 */
var mongoose = require('mongoose');


var agentModel = function() {
    var schema = new mongoose.Schema({
        _id:String,
        agentIds: [{id:String, company:String, _id:false}],
        firstName:String,
        lastName:String,
        constantExpenses:Number,
        creationTime: {type: Date, default: Date.now},
        updateTime: {type: Date, default: Date.now},
        groupedAgent:{isGrouped:Boolean,ids:[{agentId:String, percent:Number}]},
        salaries:[{companyName:String, day:Number, month:Number, year:Number, salary:Number, caseSize:Number}],
        //companies:[{
        //    name:String,
        //    salaries:[{
        //        amount:Number,
        //        month:Number,
        //        year:Number,
        //        _id:false
        //    }]
        //}],
        lastCalculatedSalary:Number
    });
    schema.index({'salaries.year':1,'salaries.month':1,'salaries.day':1});
    return mongoose.model('Agent', schema);
}();


module.exports = agentModel;