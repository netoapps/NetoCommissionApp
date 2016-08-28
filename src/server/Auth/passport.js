/**
 * Created by efishtain on 25/04/2016.
 */

var passport = require('passport');
var User = require('../Models/user');
var localPassport = require('./local-strategy');
var apiPassport = require('./api-strategy');
var express = require('express');
module.exports.init = function(app) {
    app.use(passport.initialize());

    passport.serializeUser(function (user, done) {
        done(null, user.username);
    });

// used to deserialize the user
    passport.deserializeUser(function (username, done) {
        User.findOne({username: username}, function (err, user) {
            done(err, user);
        });
    });

    localPassport.config();
    apiPassport.config();

    var authRouter = express.Router();

    authRouter.post('/register', function(req,res,next){
        passport.authenticate('local-signup', function(err,user,info){
            if(err) {return next(err)} //Internal server error
            if(!user) {
                return res.status(400).json({err:info});
            }
            delete user.password;
            return res.status(200).json({user:user});

        })(req,res,next);
    });


    authRouter.post('/login', function(req,res,next){
        passport.authenticate('local-login', function(err,user,info){
            if(err) {return next(err)} //Internal server error
            if(!user) {

                return res.status(400).json({err:info});
            }
            delete user.password;
            return res.status(200).json({user:user});
        })(req,res,next);
    });

    app.use('/auth',authRouter);
};