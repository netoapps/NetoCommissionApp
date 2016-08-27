/**
 * Created by efishtain on 25/04/2016.
 */

var shortid = require('shortid');
var mongoose = require('mongoose');
var schema = new mongoose.Schema({
    _id: {type: String, default: shortid.generate},
    creationTime: {type: Date, default: Date.now},
    updateTime: {type: Date, default: Date.now},
    name: String,
    familyName: String,
    idNumber:String,
    phoneNumber: String,
    faxNumber:String,
    email:String,
    active:Boolean,
    deleted:{type:Boolean, default:false},
    paymentsDetails:[{
        _id:false,
        companyName:String,
        agentNumber:String,
        paymentType:String,
        agentPart:String,
        agencyPart:String
    }]
});


schema.index({agentIds: 1});


module.exports = mongoose.model('Agent', schema);


