const io = require('./index.js').io
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

	socket.on(CREATE_GAME, (username, callback) => {
		const lobbyId = uuidv4()
		socket.join(lobbyId)
		addGame(username, lobbyId)
		console.log("Game Create: " + lobbyId)
		callback(lobbyId)
	})

	socket.on(JOIN_GAME, (lobbyId) => {
		socket.LobbyId = lobbyId
		socket.join(socket.LobbydD)
		joinGame(socket.LobbyId)
	})

	socket.on(REFRESH_LOBBY, (callback) => {
		const outgoing = getGames()
		callback({gameLobbies: outgoing})
		console.log("Lobby Refresh Requested")
	})

	socket.on(MAKE_MOVE, (fromX, fromY, toX, toY) => {
		io.to(socket.LobbyId).emit(RECEIVE_MOVE, fromX, fromY, toX, toY)
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
		this.gameList = []


};

function addGame(Creator, lobbyId) {
	gameCollection.totalgameCount++
	gameCollection.gameList.push({Id:lobbyId, hostname: Creator, isChallenged: false})
	console.log(gameCollection.gameList.find(g => g.Id === lobbyId))
}

function joinGame(lobbyId) {
	console.log(lobbyId)

	gameCollection.gameList.find(g => g.Id === lobbyId).isChallenged = true;
}

function endGame(lobbyId) {
	gameCollection.totalgameCount--
	delete gameCollection.gameList[lobbyId]
}

function getGames() {
	return gameCollection.gameList.filter(g => g.isChallenged !== true)
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


