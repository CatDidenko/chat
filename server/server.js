const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const models = require(__dirname + '/../models/index');
const {generateMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');

const publicPath = path.join(__dirname, '/../public/');
const port = process.env.PORT || 3000;

//console.log(models.rooms.Sequelize.Association.BelongsToMany);
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
        models.rooms.findById(room_id).then(function(room){
            room.addUsers([user_id]);
        });
        //users.addUser(socket.id, params.name, params.room);
        socket.emit('newMessage', {text: 'welcome to the chat app'});
        console.log(socket.rooms);
        //socket.broadcast.to(room_id).emit('newMessage', generateMessage('Admin', `${params.name} has joined`));
        callback();
    });

    socket.on('createMessage', (message, callback) => {

        //var user = users.getUser(socket.id);
        if(isRealString(message.text)){
            io.to(message.room_id).emit('newMessage', {text: message.text});
        }


        callback('This is from the server');
    });

    socket.on('disconnect', () => {
        models.users.findById(socket.handshake.session.user.id).then(function(user){
          user.setChat([]);
        })
    });
 });

server.listen(port);
}).catch(function(error){

});

function getUserList(){
    var people = [];
    models.users.findAll({
        include: [{
             model: models.rooms,
             as: 'Chat',
            where: {id: 2}  
        }]
    }).then(function(users){
        people.push.users;
        //console.log(users);
      //socket.emit('updateUserList', users);
    });
    return people;
}

console.log(getUserList());