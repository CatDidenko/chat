var socket = io();

socket.on('connect', function(){
    console.log('you are in system')
});
socket.on('disconnect', function(){
    console.log('Disconnected from server');
});

// socket.on('updateRoomList', .then(function(result){
//         console.log(result);

// });

    // var ul = jQuery('<ul></ul>');

    // rooms.forEach(room => {
    //     ul.append(jQuery('<li></li>').text(room.name));
    // });

    // jQuery('#rooms').html(ul);


