const io = require('./index.js').io

const {USER_VERIFY, JOIN_LOBBY, NEW_USER_LOBBY, CREATE_GAME, JOIN_GAME, USER_DISCONNECTED, LOGOUT} = require('../api/Events')

const {createUser, createGame} = require('../api/Factories')


/* Handles communication with clients */

module.exports = function (socket) {
	loginScreen[socket.id] = socket
	console.log("Socket Id:" + socket.id)


	socket.on(USER_VERIFY, (name, callback) => {
		if (isPlayer(connectedPlayers, name)) {
			console.log(name)
			callback({isUser: true, login: null})
		} else {
			addPlayer(connectedPlayers)
			callback({isUser: false, login: createUser({login: name, socketId: socket.id})})
		}
	})
	/* User joins the dashboard and updates the LobbyUser Object */
	socket.on(JOIN_LOBBY, (player) => {
		console.log("joined Lobby:" + player);
		player.socketId = socket.id;
		socket.playerList = addPlayer(inLobby, player);
	})

	socket.on(CREATE_GAME, (name, callback) => {
		console.log("Created Game")
		addPlayer(game, name)
		return game;
	})

	socket.on('disconnect', () => {
		console.log("Disconnected!");
	})
}


function removePlayer(userList, name) {
	delete userList[name];
	return userList;
}

function addPlayer(userList, player) {
	userList[player.name] = player;
	return userList;
}

function isPlayer(userList, name) {
	return name in userList
}

/*A series of object's that store collections of games or users*/

/*Collection of all existing game
  immediately invoke at runtime */
const gameCollection = new function () {
	//TODO
	this.totalgameCount = 0,
		this.gameList = {}

};

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
	this.totalgameCount = 0,
		this.gameList = {}

}