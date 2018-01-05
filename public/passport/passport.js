var bCrypt = require('bcrypt-nodejs');

module.exports = function(passport, user){
    var User = user;
    var LocalStrategy = require('passport-local').Strategy;

    passport.use('local-signup', new LocalStrategy(
        {
            usernameField: 'login',
            passwordField: 'password',
            passReqToCallback: true
        },

        function(req, login, password, done){

            var generateHash = function(password){
                return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
            };

            User.findOne({
                where: {
                    login: login
                }
            }).then(function(user){
                if(user){
                    return done(null, false, {
                        message: "That login is already taken"
                    });
                } else{
                    var userPassword = generateHash(password);
                    var data = {
                        login: login,
                        password: userPassword
                    };

                    User.create(data).then(function(newUser, created){
                        if(!newUser){
                            return done(null, false);
                        }
                        if(newUser){
                            return done(null, newUser);
                        }
                    });
                }
            });


        }
    ));

    passport.serializeUser(function(user, done){
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done){
        User.findById(id).then(function(user){

            if(user){
                done(null, user.get());
            } else {
                done(user,errors, null);
            }
        });
    });

    passport.use('local-signin', new LocalStrategy({

        usernameField: 'login',
        passwordField: 'password',
        passReqToCallback: true
    },

    function(req, login, password, done){
        var User = user;
        var isValidPassword = function(userpass, password){
            return bCrypt.compareSync(password, userpass);
        }

        User.findOne({
            where: {
                login: login
            }
        }).then(function(user){
            if(!user){
                return done(null, false, {
                    message: "Login does not exist"
                });
            }

            if(!isValidPassword(user.password, password)){
                return done(null, false, {
                    message: "Incorrect password"
                });
            }

            var userinfo = user.get();
            return done(null, userinfo);
        }).catch(function(err){
            console.log("Error", err);

            return done(null, false, {
                message: "Something went wrong"
            });
        });
    }
));
}