var chatController = require('../controllers/chatcontroller');
var {helpers} = require('../helpers/helpers');

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
        models.messages.findAll({
            where: {
                room_id: req.params.id,
            }
        }).then(function(messages){
            models.rooms.findById(req.params.id).then(function(chat){
                res.render('chat', {
                    delete: helpers.delete(chat.owner_id, req.user.id),
                    chat_id: req.params.id,
                    user_id: req.user.id,
                    messages: messages,
            })
        })
    });
    });
}