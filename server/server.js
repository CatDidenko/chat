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
var session = require('express-session');
var bodyParser = require('body-parser');
var env = require('dotenv').load();
var exphbs = require('express-handlebars');

// for Express
app.use(express.static(publicPath));

// for BodyParser
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

// for Passport
app.use(session({ secret: 'keyboard cat', resave: true, saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());

app.set('views', __dirname + '/../public/views');
app.engine('hbs', exphbs({
    extname: '.hbs'
}));
app.set('view engine', '.hbs');

require(__dirname + '/../public/passport/passport')(passport, models.users);
var authRoute = require(__dirname + '/../public/router/authrouter')(app, passport, models.rooms);
var route = require(__dirname + '/../public/router/router')(app, models);

io.on('connection', (socket)=>{

    socket.on('join', (room_id, callback) => {
        // if(!isRealString(params.name) || !isRealString(params.room)){
        //     return callback('Name and room name are required');
        // }
        socket.join(room_id);
        //users.addUser(socket.id, params.name, params.room);

        //io.to(params.room).emit('updateUserList', users.getUserList(params.room));
        socket.emit('newMessage', {text: 'welcome to the chat app'});
        //socket.broadcast.to(room_id).emit('newMessage', generateMessage('Admin', `${params.name} has joined`));
        callback();
    });

    socket.on('createMessage', (message, callback) => {

        console.log(message.text);

        //var user = users.getUser(socket.id);
        if(isRealString(message.text)){
            io.to().emit('newMessage', {text: message.text});
        }


        callback('This is from the server');
    });

//     socket.on('disconnect', () => {
//         if(user){
//             io.to(user.room).emit('newMessage', generateMessage('Admin', ` has left.`));
//         }
//     });
 });

server.listen(port);