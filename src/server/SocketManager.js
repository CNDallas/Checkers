import {AUTHENTICATE, CREATE_GAME,  USER_DISCONNECTED, LOGOUT, REFRESH_LOBBY, MAKE_MOVE, RECEIVE_MOVE, IS_GAME_OPEN, RECEIVE_MESSAGE, SEND_MESSAGE} from "../api/Events";
import uuidv4 from 'uuid/v4'

const io = require('./index.js').io;


/* Handles communication with clients */
module.exports = function (socket) {
	var nsp = io.of('/dashboard');
	console.log("User has joined");

	//Account control listeners
	socket.on(AUTHENTICATE, (sessionId, username) => {
		if (checkConnectedUsers) {
			//TODO redirect disconnected users to correct location
		} else {
			addConnectedUser(sessionId, username)
		}
		console.log("authenticated");
	});

	socket.on('disconnect', () => {
		//TODO
		console.log("Disconnected!");
	});

	//Game Lobby listeners
	socket.on(CREATE_GAME, (username, callback) => {
		const lobbyId = uuidv4();
		socket.join(lobbyId);
		socket.lobbyId = lobbyId;
		addGame(username, lobbyId);
		console.log("Game Create: " + socket.lobbyId);
		callback(lobbyId)
	});

	socket.on(IS_GAME_OPEN, (id, callback) => {
		const open = isOpen(id);
		socket.lobbyId = open ? joinGame(id):null;
		socket.join(id);
		console.log(socket.lobbyId + " isOpen: " + open);
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

	socket.on(SEND_MESSAGE, (message) => {
		socket.to(socket.lobbyId).emit(RECEIVE_MESSAGE, message);
		console.log("Message passed: " + message + " to lobby: " + socket.lobbyId);
	});



};


/*A series of object's that store collections of games or users*/

/*Collection of all existing game
  immediately invoke at runtime */
const gameCollection = new function () {
	//TODO
	this.totalgameCount = 0,
		this.gameList = []
};

function addGame(Creator, lobbyId) {
	gameCollection.totalgameCount++;
	gameCollection.gameList.push({Id:lobbyId, hostname: Creator, isOpen: true});
	console.log(gameCollection.gameList.find(g => g.Id === lobbyId))
}

function joinGame(lobbyId) {
	console.log(lobbyId);
	gameCollection.gameList.find(g => g.Id === lobbyId).isOpen = false;
	return lobbyId;
}

function isOpen(lobbyId){
	return gameCollection.gameList.find(g => g.Id === lobbyId).isOpen
}

function endGame(lobbyId) {
	gameCollection.totalgameCount--;
	delete gameCollection.gameList[lobbyId]
}

function getGames() {
	return gameCollection.gameList.filter(g => g.isOpen !== false)
}


/*Collection of users in lobby
  immediately invoke at runtime */
const lobbyUsers = new function () {
	//TODO
	this.totalgameCount = 0,
		this.gameList = {}

};


/*Collection of all logged in users*/
const connectedUsers = new function () {
	//TODO
	this.connectedUsersCount = 0,
		this.userList = {
			sessionID: {
				userName: ""
			}
		}
};

function checkConnectedUsers(sessionId) {
	return sessionId in connectedUsers.userList
}

function addConnectedUser(sessionId, login) {
	connectedUsers.connectedUsersCount++;
	this.userList[sessionId].userName = login;
}


