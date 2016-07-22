/**
 * Created by efishtain on 19/05/2016.
 */
/**
 * Created by efishtain on 25/04/2016.
 */

var shortid = require('shortid');
var mongoose = require('mongoose');
var schema = new mongoose.Schema({
    _id:{type:String, default:shortid.generate},
    creationTime:{type:Date, default:Date.now},
    updateTime:{type:Date, default:Date.now},
    pathOnDisk:String,
    name:String,
    paymentDate:Date,
    uploadDate:Date,
    company:String,
    note:String,
    taxState:String,
    taxValue:String,
    checksum:{type:String,index:true,unique:true}
});

module.exports = mongoose.model('File', schema);
