const express = require('express');
const app = express();
const server = require('http').Server(app);
const path = require('path');
const io = module.exports.io = require('socket.io')(server)


const PORT = 8081;

app.use(express.static(path.join('../../../build')));
app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname+'../../../build/index.html'));
});

/* starts up the function to handle socket events */

const SocketManager = require('./SocketManager')
io.on('connection', SocketManager)

server.listen(PORT, '0.0.0.0',function () {
	console.log('Successful Connection');
});



//TODO once we get closer to end developement. Add more security and attack prevention. Such as domain checks or using https.
//TODO Also set up a PORT looking for the environment variable and finally add more error checking and reporting
