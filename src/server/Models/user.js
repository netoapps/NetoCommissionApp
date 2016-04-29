/**
 * Created by efishtain on 25/04/2016.
 */

var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('jsonwebtoken');
var config = require('../config');
var userModel = function() {
    var schema = new mongoose.Schema({
        username: String,
        name:String,
        lastName:String,
        password:String,
        creationTime: {type: Date, default: Date.now},
        updateTime: {type: Date, default: Date.now},
        permissions:String,
        apiToken:String
    });

    // generating a hash
    schema.methods.getHash = function (password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
    };

// checking if password is valid
    schema.methods.checkPassword = function (password) {
        return bcrypt.compareSync(password, this.password);
    };

    schema.methods.getApiToken = function () {
        if (!this.username) {
            return null;
        }
        return jwt.sign({username: this.username}, config.tokens.secret);
    };

    return mongoose.model('User', schema);
}();


module.exports = userModel;