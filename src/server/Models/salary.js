/**
 * Created by efishtain on 17/05/2016.
 */
var shortid = require('shortid');

var mongoose = require('mongoose');

    var schema = new mongoose.Schema({
        _id:{type:String, default:shortid.generate},
        creationTime:{type:Date, default:Date.now},
        updateTime:{type:Date, default:Date.now},
        agentId: {type:String, index:true},
        agentInCompanyId:{type:String, index:true},
        salary:Number,
        month:Number,
        year:Number,
        type:{type:Number, enum:[3,4,5]},
        companyName:String
    });
    schema.index({year:1,month:1});

module.exports = mongoose.model('Salary', schema);