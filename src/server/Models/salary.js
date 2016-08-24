/**
 * Created by efishtain on 17/05/2016.
 */
var shortid = require('shortid');

var mongoose = require('mongoose');

    var schema = new mongoose.Schema({
        _id:{type:String, default:shortid.generate},
        creationTime:{type:Date, default:Date.now},
        updateTime:{type:Date, default:Date.now},
        agentInCompanyId: String,
        idNumber:String,
        amount:Number,
        calculatedAmount:Number,
        agencyAmount:Number,
        type:String,
        company:String,
        paymentDate:Date,
        portfolio:{type:Number, default:0},
        fileId:String,
        notes:{type: String, default:''},
        owner:{type:String, default:'agent'},
        partnershipSalaryId:{type:String, default:null}
    });
    schema.index({paymentDate:1});
    schema.index({idNumber:1});
    schema.index({fileId:1});

module.exports = mongoose.model('Salary', schema);