/**
 * Created by efishtain on 27/07/2016.
 */

var shortid = require('shortid');

var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    _id:{type:String, default:shortid.generate},
    creationTime:{type:Date, default:Date.now},
    updateTime:{type:Date, default:Date.now},
    type: String,
    sum:String,
    expanseDate:Date,
    idNumber:String,
    notes:{type:String, default:''}
});
schema.index({idNumber:1, expanseDate:1});

module.exports = mongoose.model('Expanse', schema);