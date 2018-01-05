var authController = require('../controllers/authcontroller');

module.exports = function(app, passport, rooms){

    app.get('/register', authController.register);
    app.get('/login', authController.login);
    app.get('/logout', authController.logout);

    app.get('/', isLoggedIn, (req, res)=> {
        rooms.findAll().then(function(rooms){
            res.render('index', {
            username: req.user.login,
            rooms: rooms
        });
    });
});

    app.post('/register', passport.authenticate('local-signup', {
        successRedirect: '/',
        failureRedirect: '/register'
    }));

    app.post('/login', passport.authenticate('local-signin', {
        successRedirect: '/',
        failureRedirect: '/login'
    }));
    
    function isLoggedIn(req, res, next){
        if(req.isAuthenticated()) return next();

        res.redirect('/login');
    }
};
