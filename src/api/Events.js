/**stores a module of all the events that can be called between client and server**/

module.exports = {
	AUTHENTICATE: "AUTHENTICATE",
	CREATE_GAME: "CREATE_GAME",
	USER_DISCONNECTED: "USER_DISCONNECTED",
	LOGOUT: "LOGOUT",
	REFRESH_LOBBY: "REFRESH_LOBBY",
	UPDATE_LOBBY: "UPDATE_LOBBY",
	MAKE_MOVE: "MAKE_MOVE",
	RECEIVE_MOVE: "RECEIVE_MOVE",
	IS_GAME_OPEN: "IS_GAME_OPEN", //Used to check if a game is open
	SEND_MESSAGE: "SEND_MESSAGE",
	RECEIVE_MESSAGE: "RECEIVE_MESSAGE",
	END_GAME: "END_GAME"
};
