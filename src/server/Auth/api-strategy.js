/**
 * Created by efishtain on 25/04/2016.
 */

var JwtBearerStrategy = require('passport-http-jwt-bearer').Strategy;
var User = require('../Models/user');
var passport = require('passport');
var config = require('../config');
module.exports.config = function() {

    // =========================================================================
    // API VALIDATION ==========================================================
    // =========================================================================
    passport.use('api',new JwtBearerStrategy(
        config.tokens.secret,
        function (token, done) {
            User.findOne({username:token.username}, function (err, user) {
                if (err || user == null) {
                    console.log('JwtBearerStrategy: error getting user by id: ' + token.username);
                    return done(null, false);
                }
                console.log('found user by id: '+ user.name + ' ' + user.familyName);
                return done(null, user, token);

            });
        }
    ));

};