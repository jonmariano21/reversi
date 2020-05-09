/** Set up the static file server */

/* Include static file webserver library */
var static = require('node-static');

/* Include http server library */
var http = require('http');

/* Assume that we are running on Heroku */
var port = process.env.PORT;
var directory = __dirname + '/public';

/* If we arent on Heroku, then we need to adjust the port and directory info */
if(typeof port === 'undefined' || !port) {
    directory = './public';
    port = 8080;
}

/* Set up a static webserver that will deliver files from local filesystem */
var file = new static.Server(directory);

/* Construct http server that gets files from file server */
var app = http.createServer(
    function(request, response){
        request.addListener('end', 
            function(){
                file.serve(request, response);
            }
        ).resume();
    }
).listen(port);

console.log('The server is running.');


/** Set up the web socket server */

var io = require('socket.io').listen(app);

io.sockets.on('connection', function (socket) {
    function log() {
        var array = ['*** Server Log Message: '];
        for(var i = 0; i < arguments.length; i++) {
            array.push(arguments[i]);
            console.log(arguments[i]);
        }
        socket.emit('log', array);
        socket.broadcast.emit('log', array);
    }
    log('A web site connected to the server');
    
    socket.on('disconnect', function(socket) {
        log('A web site disconnected from the server');
    });
});