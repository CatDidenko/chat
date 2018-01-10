var socket = io();

socket.on('connect', function(){
    console.log('you are in system')
});
socket.on('disconnect', function(){
    console.log('Disconnected from server');
});

socket.on('updateChatList', function(rooms){
    var ol = jQuery('<ol></ol>');

    rooms.forEach(function(room){
        ol.append(`<li><a href="/chat/${room.id}">${room.name}</a></li>`);
    });
    jQuery('#rooms').html(ol);
});


