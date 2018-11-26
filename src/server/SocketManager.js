import {AUTHENTICATE, CREATE_GAME, END_GAME, USER_DISCONNECTED, LOGOUT, REFRESH_LOBBY, MAKE_MOVE, RECEIVE_MOVE, IS_GAME_OPEN, RECEIVE_MESSAGE, SEND_MESSAGE} from "../api/Events";
import uuidv4 from 'uuid/v4'

const io = require('./index.js').io;
const dashboard = "./dashboard";

/* Handles communication with clients */
module.exports = function (socket) {
	console.log("User has joined");
	//Account control listeners
	socket.on(AUTHENTICATE, (sessionId, username) => {
		console.log("authenticating: ");
		if (checkConnectedUsers(sessionId)) {
			console.log("User is already connect with username: " + username + " and session ID: " + sessionId);
			addConnectedUser(sessionId, username);
			socket.username = username;
			socket.join(dashboard);
			socket.lobbyId = dashboard;
		} else {
			console.log("New user with username: " + username + " and session ID: " + sessionId);
			addConnectedUser(sessionId, username);
			socket.username = username;
			socket.join(dashboard);
			socket.lobbyId = dashboard;
		}
		console.log("authentication finished");
	});

	socket.on('disconnect', () => {
		//TODO
		console.log("Disconnected!");
	});

	//Game Lobby listeners
	socket.on(CREATE_GAME, (username, callback) => {
		socket.isHost = true;
		socket.leave(socket.lobbyId);
		const lobbyId = uuidv4();
		socket.lobbyId = lobbyId;
		socket.join(lobbyId);
		addGame(username, lobbyId);
		console.log("Game Created: " + socket.lobbyId);
		callback(socket.lobbyId)
	});

	socket.on(IS_GAME_OPEN, (id, callback) => {
		const open = isOpen(id);
		if (open){
			socket.lobbyId = joinGame(socket.username,id);
			socket.join(socket.lobbyId);
			socket.isHost = false;
		}
		console.log(id + " isOpen: " + open);
		callback(open);
		}
	);

	socket.on(REFRESH_LOBBY, (callback) => {
		const outgoing = getGames();
		callback({gameLobbies: outgoing});
		console.log("Lobby Refresh Requested")
	});


	//Checker's game listeners
	socket.on(MAKE_MOVE, (fromX, fromY, toX, toY) => {
		socket.to(socket.lobbyId).emit(RECEIVE_MOVE, fromX, fromY, toX, toY)
	});

	socket.on(SEND_MESSAGE, (message, callback) => {
		const recMessage = {id: uuidv4(), userName: socket.username, message: message}
		callback(recMessage);
		socket.to(socket.lobbyId).emit(RECEIVE_MESSAGE, recMessage);
		console.log("Message passed: " + message + " to lobby: " + socket.lobbyId);
	});

	socket.on(END_GAME, () => {
		if (socket.isHost){
			endGame(socket.lobbyId);
		}
		exitgameConnectedUsers(socket.username);
		socket.lobbyId = dashboard;
		socket.isHost = null;
	});



};


/*A series of object's that store collections of games or users*/

/*Collection of all existing game
  immediately invoke at runtime */
const gameCollection = new function () {
	//TODO
	this.totalgameCount = 0;
	this.gameList = []
};

function addGame(Creator, lobbyId) {
	gameCollection.totalgameCount++;
	gameCollection.gameList.push({Id:lobbyId, hostname: Creator, isOpen: true});
	toGameConnectedUsers(Creator, lobbyId);
	console.log(gameCollection.gameList.find(g => g.Id === lobbyId));
	return lobbyId;
}

function joinGame(user, lobbyId) {
	console.log(lobbyId);
	gameCollection.gameList.find(g => g.Id === lobbyId).isOpen = false;
	gameCollection.gameList.find(g => g.Id === lobbyId).opponent = user;
	toGameConnectedUsers(user, lobbyId);
	return lobbyId;
}

function isOpen(lobbyId){
	return gameCollection.gameList.find(g => g.Id === lobbyId).isOpen
}

function endGame(lobbyId) {
	gameCollection.totalgameCount--;
	delete gameCollection.gameList[lobbyId];
}

function getGames() {
	return gameCollection.gameList.filter(g => g.isOpen !== false);
}

function getAllGames(){
	return gameCollection.gameList;
}



/*Collection of all logged in users with location*/
const connectedUsers = new function () {
	//TODO
	this.userCount = 0;
	this.lobbyCount = 0;
	this.inGameCount = 0;
	this.userList = [];
};

function checkConnectedUsers(sessionId) {
	return connectedUsers.userList.find(user => user.Id === sessionId);
}

function addConnectedUser(sessionId, userName) {
	connectedUsers.userCount++;
	connectedUsers.userList.push({Id: sessionId, username: userName, location: 'Unknown'});
	console.log(connectedUsers.userList[connectedUsers.userList.length - 1]);
	toDashboardConnectedUser(userName)//TODO may not want to automatically put the user into dashboard... be sure to change if such is decided
}

function toDashboardConnectedUser(userName){
	connectedUsers.lobbyCount++;
	connectedUsers.userList.find(user => user.username === userName).location = dashboard;
}

function toGameConnectedUsers(userName, lobbyId){
	connectedUsers.lobbyCount--;
	connectedUsers.inGameCount++;
	console.log("Adding user: " + userName + " to lobby: " + lobbyId);
	console.log(connectedUsers.userList.find(user => user.username === userName).username);
	connectedUsers.userList.find(user => user.username === userName).location = lobbyId;
}

function exitgameConnectedUsers(userName){
	connectedUsers.inGameCount--;
	toDashboardConnectedUser(userName);
}

function logOutConnectedUser(sessionId){
	connectedUsers.userCount--;
	if ((connectedUsers.userList.find(user => user.Id === sessionId).location) === dashboard){
		connectedUsers.lobbyCount--;
	} else {
		connectedUsers.inGameCount--;
	}
	delete connectedUsers.userList[sessionId];
}

function getUserList (){
	return connectedUsers.userList;
}

