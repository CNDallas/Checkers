const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = module.exports.io = require('socket.io')(server)

const PORT = 8081


/* starts up the function to handle socket events */

const SocketManager = require('./SocketManager')
io.on('connection', SocketManager)

server.listen(PORT, function () {
	console.log('Successful Connection');
});


//TODO once we get closer to end developement. Add more security and attack prevention. Such as domain checks or using https.
//TODO Also set up a PORT looking for the environment variable and finally add more error checking and reporting
