/**
 * Created by efishtain on 08/08/2016.
 */

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
    value: [String]
});


schema.index({name: 1});


module.exports = mongoose.model('Constant', schema);


