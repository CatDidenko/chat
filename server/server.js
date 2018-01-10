const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const models = require(__dirname + '/../models/index');
const {generateMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');

const publicPath = path.join(__dirname, '/../public/');
const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var passport = require('passport');
var session = require('express-session')(
    { 
        secret: 'keyboard cat', 
        resave: true, 
        saveUninitialized: true
   }
);
var bodyParser = require('body-parser');
var env = require('dotenv').load();
var exphbs = require('express-handlebars');
var sharedsession = require('express-socket.io-session');

// for Express
app.use(express.static(publicPath));

// for BodyParser
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

// for Passport
app.use(session);
app.use(passport.initialize());
app.use(passport.session());

app.set('views', __dirname + '/../public/views');
app.engine('hbs', exphbs({
    extname: '.hbs'
}));
app.set('view engine', '.hbs');

models.sequelize.sync().then(function(){

require(__dirname + '/../public/passport/passport')(passport, models.users);
var authRoute = require(__dirname + '/../public/router/authrouter')(app, passport, models.rooms);
var route = require(__dirname + '/../public/router/router')(app, models);

io.use(sharedsession(session, {
    autoSave: true
}));

io.on('connection', (socket)=>{

   socket.on('join', (room_id, callback) => {
        socket.join(room_id);

        var user_id = socket.handshake.session.user.id;
        var login = socket.handshake.session.user.login;

        socket.emit('newMessage', {text: 'Welcome to the chat app'});
        
        io.to(room_id).emit('newMessage', {text: `${login} has joined`});

        models.rooms.findById(room_id).then(function(room){
            room.addPeople([user_id]);
        });
        
        callback();
    });

    socket.on('createMessage', (message, callback) => {

        var id = socket.handshake.session.user.id;

        if(isRealString(message.text)){
            io.to(message.room_id).emit('newMessage', {text: message.text});
            models.messages.create({
                text: message.text,
                author_id: id,
                room_id: message.room_id,
            });
        }
        callback('This is from the server');
    });

    socket.on('createChat', (name) => {

        var id = socket.handshake.session.user.id;

        models.rooms.create({
            name: name,
            owner_id: id
        }).then(function(){
            socket.emit('redirect', '/');
        }).then(function(){
            models.rooms.findAll().then(function(rooms){
                io.emit('updateChatList', rooms);
            });
        });
    });

    socket.on('deleteAction', (room_id) => {
        models.rooms.destroy({
            where: {
                id: room_id
            }
        }).then(function(){
            socket.emit('redirect', '/');
        }).then(function(){
            models.rooms.findAll().then(function(rooms){
                io.emit('updateChatList', rooms);
            });
        });
    });

    socket.on('updateUserList', (room_id = '') => {
        models.users.findAll({
            include: [{
                    model: models.rooms,
                    as: 'Chat',
                    where: {id: room_id} 
                    
            }]
        }).then(function(users){
            io.emit('getUserList', users);
    });
});

    socket.on('disconnect', () => {
        // io.emit('deleteFromChat');
        // io.emit('updateUserList');

        models.users.findById(socket.handshake.session.user.id).then(function(user){
            io.emit('newMessage', {text: `User ${user.login} leave chat`});
            user.setChat([]);
        });
    }); 
            

 });

server.listen(port);
}).catch(function(error){

});
