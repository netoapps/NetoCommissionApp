/**
 * Created by efishtain on 25/04/2016.
 */


var LocalStrategy = require('passport-local').Strategy;
var passport = require('passport');
var User = require('../Models/user');

module.exports.config = function () {

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    passport.use('local-login', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
        },
        function (req, username, password, done) {

            // check if the user is already logged in
            if (req.user) {
                return done(null,req.user,'already logged in');
            }

            if (!username || username == '')
                return done(null,false,"Missing username address");

            username = username.toLowerCase(); // Use lower-case e-mails to avoid case-sensitive e-mail matching

            // asynchronous
            process.nextTick(function () {
                User.findOne({'username': username}, function (err, user) {
                    // if there are any errors, return the error
                    if (err)
                        return done(err);

                    if (!user)
                        return done(null, false, 'The username address you\'ve provided doesn\'t match any account.');

                    if (!user.checkPassword(password))
                        return done(null, false,  'The password you\'ve entered is incorrect.');

                    return done(null, user);
                });
            });

        }));

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    passport.use('local-signup', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
        },
        function (req, username, password, done) {
            if (username)
                username = username.toLowerCase(); // Use lower-case e-mails to avoid case-sensitive e-mail matching

            // asynchronous
            process.nextTick(function () {

                if (req.user) {
                    return done(new Error('Already logged in'));
                }
                // if the user is not already logged in:
                User.findOne({'username': username}, function (err, user) {
                    // if there are any errors, return the error
                    if (err)
                        return done(err);

                    if (user)
                        return done(null, false, 'The email address you\'ve provided is already registered');


                    // create the user
                    var newUser = new User();
                    newUser.username = username;
                    newUser.password = newUser.getHash(password);

                    if(req.body.name){
                        newUser.name = req.body.name;
                    }
                    if(req.body.lastName){
                        newUser.lastName = req.body.lastName;
                    }

                    newUser.save(function (err) {
                        if (err)
                            return done(err);

                        newUser.apiToken = newUser.getApiToken();
                        newUser.save(function (err) {
                            if (err) {
                                console.log('err: '+err);
                                return done(err);
                            }
                            return done(null, newUser);
                        });

                    });

                });
            });
        })
    );
}