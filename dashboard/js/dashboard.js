// import react, {Component } from 'react';
//
// class dashboard extends component {
//     render(){
//         //the webpage and what not
//     }
// }

var socket = io('/dashboard');
var games = {};
var onlineUsers = {};
var userID = "";

socket.on('onLogin', function(){
    console.log("create: "+ userID);
    userID =  Math.floor(Math.random() * 10000);//TODO needs to be updated with the users name
    socket.emit('username',userID);
});

function createGame(){
    socket.emit('newGame', userID);
    window.location.href = '../checkers';
}

socket.on('openGame', (userID)=> {
    document.getElementById("openGames").innerHTML= userID;
});

socket.on('joinLobby', (userID)=>{
    console.log("Join Lobby");
    //onlineUsers.push(userID);
   // updateUserList();
});

//export default dashboard;


// var updateUserList = function() {
//     document.getElementById('userList').innerHTML = '';
//     usersOnline.forEach(function(user) {
//         $('#userList').append($('<button>')
//             .text(user)
//             .on('click', function() {
//                 socket.emit('invite',  user);
//             }));
//     });
// };
