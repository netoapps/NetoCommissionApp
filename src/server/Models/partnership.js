/**
 * Created by efishtain on 03/07/2016.
 */

var shortid = require('shortid');
var mongoose = require('mongoose');
var schema = new mongoose.Schema({
    _id: {type: String, default: shortid.generate},
    creationTime: {type: Date, default: Date.now},
    updateTime: {type: Date, default: Date.now},
    active:Boolean,
    agentsIdsSha1:{type:String,index:true},
    agentsDetails:[{_id:false,idNumber:String, part:String}],
    paymentsDetails:[{
        _id:false,
        companyName:String,
        partnershipNumber:String,
        paymentType:String,
        partnershipPart:String,
        agencyPart:String
    }]
});


module.exports = mongoose.model('Partnership', schema);

