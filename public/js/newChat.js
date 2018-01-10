var socket = io();

jQuery('#chat-form').on('submit', function(e){
    e.preventDefault();
    var name = jQuery('[name=room]').val();

    socket.emit('createChat', name);
});

socket.on('redirect', function(destination){
    window.location.href = destination;
});