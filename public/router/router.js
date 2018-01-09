var chatController = require('../controllers/chatcontroller');

module.exports = function(app, models){

    app.get('/create_chat', chatController.createChat);

    app.post('/create_chat', (req, res) => {
        models.rooms.create({
            name: req.body.room,
            owner_id: req.user.id
        }).then(function(rooms){
            //rooms.setUsers([req.user.id]);
            res.redirect('/');
    });
    });

    app.get('/chat/:id', (req, res) => {
        // models.users.findAll({
        //     include: [{
        //         model: models.rooms,
        //         //through: {
        //             where: {id: req.params.id}
        //         //} 
        //     }]
        // }).then(function(users){
            models.messages.findAll().then(function(messages){
                res.render('chat', {
                messages: messages,
                //users: users
            })
        });
   // });
    });
}