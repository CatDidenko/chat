var authController = require('../controllers/authcontroller');

module.exports = function(app){
    app.get('/register', authController.register);
};