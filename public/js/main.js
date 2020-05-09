/* Functions for general use */

/* This function returns the value associated with the 'whichParam' on the URL */
function getURLParameters(whichParam){
    var pageURL = window.location.search.substring(1);
    var pageURLVariables = pageURL.split('&');

    console.log('Inside getURLParameters() function');

    for(var i = 0; i < pageURLVariables.length; i++) {
        var parameterName = pageURLVariables[i].split('=');
        if(parameterName[0] == whichParam) {
            console.log('parameterName= ' + parameterName);
            return parameterName[1];
        }
    }

}

var username = getURLParameters('username');

if('undefined' == typeof username || !username){
    username = 'Anonymous_' + Math.random();
}

//$('#messages').append('<h4>' + username + '</h4>');

var chat_room = 'One_Room_To_Rule_Them_All';

/* Connect to the socket server */

var socket = io.connect();

socket.on('log', function(array) {
    console.log.apply(console, array);
});

socket.on('join_room_response', function(payload) {
    if(payload.result == 'fail') {
        alert(payload.message);
        return;
    }
    $('#messages').append('<p> New user joined the room: ' +payload.username+ '</p>');
});



socket.on('send_message_response', function(payload) {
    if(payload.result == 'fail') {
        alert(payload.message);
        return;
    }

    console.log('BEFOER APPEND!!');

    $('#messages').append('<p><b>'+payload.username+' says:</b> '+payload.message+' </p>');

    console.log('USERNAME: '+payload.username);
    console.log('MESSAGE: '+payload.message);

});


function send_message(){
    var payload = {};
    payload.room = chat_room;
    payload.username = username;
    payload.message = $('#send_message_holder').val();
    console.log('*** Client Log Message: \'send_message\' payload: '+JSON.stringify(payload));
    socket.emit('send_message', payload);
}





//Send message that we are interested in joining a room
$(function(){
    var payload = {};
    payload.room = chat_room;
    payload.username = username;

    console.log('*** Client Log Message: \'join_room\' payload: '+JSON.stringify(payload));
    socket.emit('join_room', payload);
});
