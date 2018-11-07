const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

var users = {};
var activeGames = {};

app.use(express.static(__dirname + '/checkers'));
app.use(express.static(__dirname + '/dashboard'));
app.use(express.static(__dirname + '/login'));

app.get('/', (req, res)=> {
    res.sendFile(__dirname + '/login/index.html');
});

app.get('/dashboard/', (req, res)=> {
  res.sendFile(__dirname + '/dashboard/dashboard.html');
});

app.get('/checkers/', (req, res)=> {
    res.sendFile(__dirname + '/checkers/game.html');
});

var dashboard = io.of('/dashboard');
dashboard.on('connection', function(socket){
    console.log('dashboard');
   socket.emit('onLogin');
   socket.on('username',function(userID){
       console.log(userID);
       users[userID] = socket;
       dashboard.emit('joinLobby', userID);
   });
    socket.on('newGame',function(userID){
        console.log("openGame");
        dashboard.emit('openGame',userID);
    });
    socket.on('disconnect', function () {
        console.log('A user disconnected from dashboard');
    });
});

var checkers = io.of('/checkers');
checkers.on('connection', function(socket){
    console.log('checkers');
    socket.on('disconnect', function () {
        console.log('A user disconnected from checkers');
    });
});



server.listen(3000, function() {
    console.log('Successful Connection');
});


