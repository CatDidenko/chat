var chatController = require('../controllers/chatcontroller');

module.exports = function(app, models){

    app.get('/create_chat', chatController.createChat);

    app.post('/create_chat', (req, res) => {
        models.rooms.create({
            name: req.body.room,
            owner_id: req.user.id
        }).then(function(rooms){
            res.redirect('/');
    });
    });

    app.get('/chat/:id', (req, res) => {
        messages.findAll().then(function(messages){
            res.render('chat', {
            messages: messages
        });
    });
    });

}