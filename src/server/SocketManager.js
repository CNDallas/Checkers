const io = require('./index.js')
const uuidv4 = require('uuid/v4');


const {AUTHENTICATE, USER_VERIFY, JOIN_LOBBY, NEW_USER_LOBBY, CREATE_GAME, JOIN_GAME, USER_DISCONNECTED, LOGOUT, REFRESH_LOBBY, UPDATE_LOBBY, MAKE_MOVE, RECEIVE_MOVE} = require('../api/Events')

/* Handles communication with clients */
module.exports = function (socket) {
	var nsp = io.of('/dashboard');
	console.log("User has joined");

	socket.on(AUTHENTICATE, (sessionId, username) => {
		if (checkConnectedUsers) {
			//TODO redirect disconnected users to correct location
		} else {
			addConnectedUser(sessionId, username)
		}
		console.log("authenticated");
	})

	socket.on(CREATE_GAME, (username) => {
		socket.LobbyID = uuidv4()
		socket.join(socket.LobbyID)
		addGame(username, socket.LobbyID)
	})

	socket.on(JOIN_GAME, (lobbyID) => {
		socket.LobbyID = lobbyID
		socket.join(socket.LobbyID)
		joinGame(socket.LobbyID)
	})

	socket.on(REFRESH_LOBBY, () => {
		socket.emit(UPDATE_LOBBY, gameCollection.gameList)
	})

	socket.on(MAKE_MOVE, (fromX, fromY, toX, toY) => {
		io.to(socket.LobbyID).emit(RECEIVE_MOVE, fromX, fromY, toX, toY)
	})


	//
	// socket.on('disconnect', () => {
	// 	console.log("Disconnected!");
	// })
}


/*A series of object's that store collections of games or users*/

/*Collection of all existing game
  immediately invoke at runtime */
const gameCollection = new function () {
	//TODO
	this.totalgameCount = 0,
		this.gameList = {
			ID: {
				'host': "",
				'foundOpp': false
			}
		}

};

function addGame(Creator, lobbyID) {
	gameCollection.totalgameCount++
	gameCollection.gameList[lobbyID] = {host: Creator, foundOpp: false}
}

function joinGame(lobbyID) {
	gameCollection.gameList[lobbyID].foundOpp = true
}

function endGame(lobbyID) {
	gameCollection.totalgameCount--
	delete gameCollection.gameList[lobbyID]
}

function getGame() {
	return gameCollection.gameList
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
	connectedUsers.connectedUsersCount++
	this.userList[sessionId].userName = login;
}


