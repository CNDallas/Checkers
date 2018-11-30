import {AUTHENTICATE, CREATE_GAME, END_GAME, USER_DISCONNECTED, LOGOUT, REFRESH_LOBBY, MAKE_MOVE, RECEIVE_MOVE, IS_GAME_OPEN, RECEIVE_MESSAGE, SEND_MESSAGE, REQUEST_STATS, USER_WIN, USER_LOSE, USER_KING,USER_JOINED_HOSTS_GAME} from "../api/Events";
import uuidv4 from 'uuid/v4'
const util = require('util')


const io = require('./index.js').io;
const dashboard = "./dashboard";
const database = require('./database.js');

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
			socket.join(username);
			socket.lobbyId = dashboard;
		} else {
			console.log("New user with username: " + username + " and session ID: " + sessionId);
			addConnectedUser(sessionId, username);
			socket.username = username;
			socket.join(dashboard);
			socket.join(username);
			socket.lobbyId = dashboard;
		}
		console.log("authentication finished");
	});

	socket.on(REQUEST_STATS, (username, callback) => {
		dbGetStats(username,  (total_games,wins,total_kings) => {
			callback(total_games,wins,total_kings)
		});
	});
	socket.on(USER_WIN, () =>{
		dbAddWin(socket.username);
		dbAddGame(socket.username);
	});
	socket.on(USER_LOSE, () =>{
		dbAddGame(socket.username)
	});
	socket.on(USER_KING, () =>{
		dbAddKing(socket.username)
	});

	socket.on(LOGOUT, (username) => {
		socket.username = '';
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
			socket.to(socket.lobbyId).emit(RECEIVE_MESSAGE,systemMessage(socket.username + " has joined the game!",uuidv4()));
			socket.to(socket.lobbyId).emit(USER_JOINED_HOSTS_GAME, socket.username);
		} else {
			io.to(socket.id).emit(RECEIVE_MESSAGE, systemMessage("Game is no longer available",uuidv4()))
		}
		console.log(id + " isOpen: " + open);
		callback(open);
		}
	);

	socket.on(REFRESH_LOBBY, (callback) => {
		const outgoing = getGames();
		io.to(socket.id).emit(RECEIVE_MESSAGE,systemMessage("Lobby Refreshed",uuidv4()))
		callback({gameLobbies: outgoing});
		console.log("Lobby Refresh Requested")
	});


	//Checker's game listeners
	socket.on(MAKE_MOVE, (fromX, fromY, toX, toY) => {
		socket.to(socket.lobbyId).emit(RECEIVE_MOVE, fromX, fromY, toX, toY)
	});

	socket.on(END_GAME, () => {
		if (socket.isHost){
			endGame(socket.lobbyId);
		}
		exitgameConnectedUsers(socket.username);
		socket.lobbyId = dashboard;
		socket.isHost = null;
	});

	//Chat listeners
	socket.on(SEND_MESSAGE, (message, callback) => {
		const genId = uuidv4();

		if (message.charAt(0) === '/') { //Command initiated
			let messageArray = message.split(" ");
			messageArray = messageArray.filter(m => m !== "");
			console.log("Command rec: " + messageArray);

			if (messageArray[0].toLowerCase() === "/w") { //Sends private message
				if (!messageArray[1]){
					callback(systemMessage("No username given",genId))
				} else 	if (!messageArray[2]){
					callback(systemMessage("No message given",genId))
				} else {
					const toUser = messageArray[1];
					const pm = messageArray.slice(2, messageArray.length + 1).join(" ");
					const toSender = privateMessage(socket.username, toUser, pm,genId);
					console.log("Private Message To: " + toUser + " Message: " + pm);
					console.log("Private Message Return: " + toSender);
					callback(toSender);
				}

			} else if (messageArray[0].toLowerCase() === "/all") {
				const messageToAll = {
					id: genId,
					userName: "To All: " + socket.username,
					message: messageArray.slice(1, messageArray.length + 1).join(" "),
					color: "#FFFFFF"
				};
				const toSender = {
					id: genId,
					userName: "To All: " + socket.username,
					message: messageArray.slice(1, messageArray.length + 1).join(" "),
					color: "#FFA700"
				};
				socket.broadcast.emit(RECEIVE_MESSAGE, messageToAll);
				callback(toSender)

			}else if (messageArray[0].toLowerCase() === "/stats"){
				if (!messageArray[1]) {
					callback(systemMessage("No username given", genId));
				}else {
					const userName = messageArray[1];
					dbIsUser(userName, (isUser) => {
						if (isUser) {
							dbGetStats(userName, (total_games,wins,total_kings) => {
								const message = "Stats for User: " + userName + " -- Total Games: " + total_games + " Wins: " + wins + " Total Times Kinged: " + total_kings
								callback(systemMessage(message, genId));
							})

						} else {
							callback(systemMessage("No such user found", genId));
						}
					})

				}

			}else if (messageArray[0].toLowerCase() === "/addwin"){ // TODO remove but can be used for testing atm
				dbAddWin(socket.username);
				callback(systemMessage("Req to add win initiated", genId));
			}else if (messageArray[0].toLowerCase() === "/addgame"){
				dbAddGame(socket.username);
				callback(systemMessage("Req to add game initiated", genId));
			}else if (messageArray[0].toLowerCase() === "/addking"){
				dbAddKing(socket.username);
				callback(systemMessage("Req to add king initiated", genId));
			}
			else {
				const toSender = systemMessage(messageArray[0] + " is not a valid command",genId)
				callback(toSender)

			}
		}else { //sends message to current lobby
			const recMessage = {id: genId, userName: socket.username, message: message, color: "#FFFFFF"};
			const toSender = {id: genId, userName: socket.username, message: message, color: "#ffa700"};
			socket.to(socket.lobbyId).emit(RECEIVE_MESSAGE, recMessage);
			callback(toSender);
			console.log("Message passed: " + message + " to lobby: " + socket.lobbyId);
		}


	});

	function privateMessage(fromUser,toUser,pm,genId){
		if (isUser(toUser)) {
			const messageOut = {id: genId, userName: "PM from "+ fromUser, message: pm, color: "#0e495f"};
			io.to(toUser).emit(RECEIVE_MESSAGE, messageOut);
			return {id: genId, userName: "PM to "+ toUser, message: pm, color: "#ffe267"};
		} else {
			console.log("User not found for PM: " + toUser);
			return systemMessage("The user: " + toUser + " is not online",genId);

		}
	}

	function systemMessage(message,genId){
		const output ={id: genId, userName: "SYSTEM", message: message, color: "#FF0000"};
		console.log("System Message: " + output.message +"message Id: " + output.id);
		return output;
	}
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
	dbGetStats(Creator, (total_games,wins,total_kings) => {
	gameCollection.gameList.push({Id:lobbyId, hostname: Creator, isOpen: true, total_games, wins , total_kings});
	toGameConnectedUsers(Creator, lobbyId);
	console.log(gameCollection.gameList.find(g => g.Id === lobbyId));
	});
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
	this.userList = []; //Layout {Id: sessionId, username: userName, location: 'Location'}
};

function checkConnectedUsers(sessionId) {
	return connectedUsers.userList.find(user => user.Id === sessionId);
}

function isUser(userName) {
	return connectedUsers.userList.find(user => user.username === userName);
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


//DATABASE FUNCTIONS

function dbGetStats(username, callback) {
	database.execute('SELECT * FROM users WHERE users.username = ?', [username])
		.then(([username]) =>{
			const{total_games,wins,total_kings} = username[0];
			console.log(total_games,wins,total_kings);
			return callback(total_games,wins,total_kings);
		})
		.catch((err) =>{
			console.log("Man Down: " + err);
		});
}

function dbIsUser(userName, callback) {
	database.execute('SELECT * FROM users WHERE users.username = ?', [userName])
		.then(([username]) => {
			console.log(username.length);
			return callback(username.length)
		})
		.catch((err) => {
			console.log(err);
			return callback(false);
		});
}

function dbAddWin(userName){
	database.execute('UPDATE users SET wins = wins + 1 WHERE username = ?',[userName])
		.then( () => {
			console.log("DB add win to user: " + userName);
		})
		.catch( (err)=>
		{
			console.log(err);
		});
}

function dbAddGame(userName){
	database.execute('UPDATE users SET total_games = total_games + 1 WHERE username = ?',[userName])
		.then( () => {
			console.log("DB add game to user: " + userName);
		})
		.catch( (err)=>
		{
			console.log(err);
		});
}

function dbAddKing(userName){
	database.execute('UPDATE users SET total_kings = total_kings + 1 WHERE username = ?',[userName])
		.then( () => {
			console.log("DB add kings to user: " + userName);
		})
		.catch( (err)=>
		{
			console.log(err);
		});
}
