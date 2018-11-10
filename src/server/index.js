/* Sets up the server and keeps it running */

import http from 'http'
import app from '../../app';

const PORT = 8080


/*Basic logger*/
function log(message) {
	process.stdout.write(`${message}\n`);
}

app.set('port',PORT);
const server = http.createServer(app);

function startServer(serverPort) {
	server.listen(PORT);
}
startServer(PORT);

/* starts up the function to handle socket events */
var io = module.exports.io = require('socket.io')(server)
const SocketManager = require('./SocketManager')
io.on('connection', SocketManager)



//TODO once we get closer to end developement. Add more security and attack prevention. Such as domain checks or using https.
//TODO Also set up a PORT looking for the environment variable and finally add more error checking and reporting