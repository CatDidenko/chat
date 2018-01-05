var socket = io();
var models = require('/../models/index');

function scrollToBottom(){
    var messages = jQuery('#messages');
    var newMessage = messages.children('li:last-child');
    var clientHeight = messages.prop('clientHeight');
    var scrollTop = messages.prop('scrollTop');
    var scrollHeight = messages.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight();

    if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight){
        messages.scrollTop(scrollHeight);
    }
}
socket.on('connect', function(){

console.log(models);
var room_id = (window.location.pathname.split('/')).pop();

socket.emit('join', room_id, function(err){
    if(err){
        alert(err);
        window.location.href = '/';
    } else {
         console.log('No errors');
    }
});
});
socket.on('disconnect', function(){
    console.log('Disconnected from server');
});

// socket.on('updateUserList', function(users){
//     var ul = jQuery('<ul></ul>');

//     users.forEach(function(user){
//         ul.append(jQuery('<li></li>').text(user));
//     });

//     jQuery('#users').html(ul);
// });

socket.on('newMessage', function(message){
   
    var formattedTime = moment(message.createdAt).format('h:mm a MMM Do, YYYY');
   
    // console.log(template);
    // var html = Mustache.render(template, {
    //     text: message.text,
    //     createAt: formattedTime
    // });

    //jQuery('#messages').append(html);

    //console.log(jQuery('#messages').html());
    //scrollToBottom();
});

jQuery('#message-form').on('submit', function(e){
    e.preventDefault();

    var messageTextbox = jQuery('[name=message]');

    socket.emit('createMessage', {
        text: messageTextbox.val()
    }, function(){
        messageTextbox.val('');
    });
});