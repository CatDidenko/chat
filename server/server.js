const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const models = require(__dirname + '/../models/index');

const {generateMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');

const publicPath = path.join(__dirname, '/../public/');
const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

app.use(express.static(publicPath));
io.on('connection', (socket)=>{
    //console.log("New user connected");
    // models.users.findAll().then(function(users){
    //     console.log(users);
    // });
    //models.users.create({login: "kittycat_13", password: "k13111996"});
    // models.users.findAll().then(function(users){
    //     console.log(users);
    // });
    // socket.on('create', (params, callback) => {
    //     if(!isRealString(params.name) || !isRealString(params.room)){
    //         return callback('Name and room name are required');
    //     }
    //     models.rooms.create({name:params.name, owner_id:})
    //     socket.join(params.room);
    //     users.addUser(socket.id, params.name, params.room);

    //     io.to(params.room).emit('updateUserList', users.getUserList(params.room));
    //     socket.emit('newMessage', generateMessage('Admin', 'Welcom to the chat app'));
    //     socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined`));
    //     callback();
    // });

    socket.on('join', (params, callback) => {
        if(!isRealString(params.name) || !isRealString(params.room)){
            return callback('Name and room name are required');
        }
        models.rooms.create({})
        socket.join(params.room);
        users.addUser(socket.id, params.name, params.room);

        io.to(params.room).emit('updateUserList', users.getUserList(params.room));
        socket.emit('newMessage', generateMessage('Admin', 'Welcom to the chat app'));
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined`));
        callback();
    });

    socket.on('createMessage', (message, callback) => {
        var user = users.getUser(socket.id);
        if(user && isRealString(message.text)){
            io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
        }


        callback('This is from the server');
    });

    socket.on('disconnect', () => {
        var user = users.removeUser(socket.id);
        if(user){
            io.to(user.room).emit('updateUserList', users.getUserList(user.room));
            io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left.`));
        }
    });
});

server.listen(port);
