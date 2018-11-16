/**stores a module of all the events that can be called between client and server**/

module.exports = {
	AUTHENTICATE: "AUTHENTICATE",
	USER_VERIFY: "USER_VERIFY",
	JOIN_LOBBY: "JOIN_LOBBY",
	CREATE_GAME: "CREATE_GAME",
	JOIN_GAME: "JOIN_GAME",
	USER_DISCONNECTED: "USER_DISCONNECTED",
	LOGOUT: "LOGOUT",
	REFRESH_LOBBY: "REFRESH_LOBBY",
	UPDATE_LOBBY: "UPDATE_LOBBY",
	MAKE_MOVE: "MAKE_MOVE",
	RECEIVE_MOVE: "RECEIVE_MOVE",
	IS_OPEN: "IS_OPEN" //Used to check if a game is open
};
