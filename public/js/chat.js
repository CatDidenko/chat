var socket = io();

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
var room_id = (window.location.pathname.split('/')).pop();

socket.emit('join', room_id, function(err){
    if(err){
        alert(err);
        window.location.href = '/';
    } else {
         console.log('No errors');
         socket.emit('updateUserList', room_id);
    }
});
});
socket.on('disconnect', function(){
    console.log('Disconnected from server');
});

socket.on('newMessage', function(message){
   
    var formattedTime = moment(message.createdAt).format('h:mm a MMM Do, YYYY');
    var source = jQuery('#message-template').html();
    var template = Handlebars.compile(source);
    var data = {
        text: message.text,
        createdAt: formattedTime
    };

    var html = template(data);
    jQuery('#messages').append(html);
});

jQuery('#message-form').on('submit', function(e){
    e.preventDefault();

    var room_id = (window.location.pathname.split('/')).pop();
    var messageTextbox = jQuery('[name=message]');

    socket.emit('createMessage', {
        room_id: room_id,
        text: messageTextbox.val(),
    }, function(){
        messageTextbox.val('');
    });
});

jQuery('#deleteRoom').on('click', function(){
    var room_id = (window.location.pathname.split('/')).pop();
    socket.emit('deleteAction', room_id);
});

socket.on('redirect', function(destination){
    window.location.href = destination;
});

socket.on('getUserList', function(users){
    var ol = jQuery('<ol></ol>');
    users.forEach(function(user){
        ol.append(`<li>${user.login}</a></li>`);
    });
    jQuery('#users').html(ol);
});


