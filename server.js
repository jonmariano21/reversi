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



