var authController = require('../js/authcontroller');

module.exports = function(app){
    app.get('/register', authController.register);
};