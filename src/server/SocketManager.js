const {
  AUTHENTICATE,
  CREATE_GAME,
  JOIN_GAME,
  END_GAME,
  USER_DISCONNECTED,
  LOGOUT,
  REFRESH_LOBBY,
  MAKE_MOVE,
  RECEIVE_MOVE,
  RECEIVE_MESSAGE,
  SEND_MESSAGE,
  REQUEST_STATS,
  USER_WIN,
  USER_LOSE,
  USER_KING,
  USER_JOINED_HOSTS_GAME
} = require("../api/Events");
const uuidv4 = require("uuid");
const io = require("./index.js").io;
const dashboard = "dashboard";
const util = require("util");
const Games = require("./modules/dbGames.js");
const Users = require("./modules/dbUsers.js");
const Online = require("./modules/dbOnline.js");

/* Handles communication with clients */
module.exports = function(socket) {
  console.log("User has joined");

  socket.on(AUTHENTICATE, async(sessionId, username, cb) => {
    console.log("authenticating: ");
    if(await Online.IsUserOnline(username)){
	   Online.GetUserLocation(username)
		    .then(result =>{
		    	socket.lobbyId = result;
		    	socket.join(result);
			    cb(socket.lobbyId);
			    console.log(
				    "User is already connect with username: " +
				    username +
				    " and session ID: " +
				    sessionId
			    );
		    }).catch((err)=>{

	   })
	    socket.username = username;
    } else {
	    Online.AddOnlineUser(username, sessionId, socket.id)
		    .then(() => {
			    console.log(
				    "New Online user with username: " +
				    username +
				    " and session ID: " +
				    sessionId
			    );
		    })
	    socket.username = username;
	    socket.join(dashboard);
	    socket.join(username);
	    socket.lobbyId = dashboard;
	    cb(socket.lobbyId)
    }
    console.log("authentication finished");
  })


  socket.on(REQUEST_STATS, (username, callback) => {
    Users.GetStats(username)
	    .then(results => {
      const {ranking,total_games, wins, total_kings} = results;
      callback(ranking,total_games, wins, total_kings);
    });
  });

  socket.on(USER_WIN, () => {
    Users.AddWin(socket.username);
    Users.AddGameTotal(socket.username);
    Games.OpponentLookUp(socket.username, socket.lobbyId)
	    .then(results => {
            const rankChange = calculateRank(socket.username, results,true);
            const loserRankChange = calculateRank(results,socket.username,false);
            Users.UpdateRank(socket.username, rankChange);
            Users.UpdateRank(results,loserRankChange);
    });
  });

  socket.on(USER_LOSE, () => {
    Users.AddGameTotal(socket.username);
  });

  socket.on(USER_KING, () => {
    Users.AddKing(socket.username);
  });

  socket.on(LOGOUT, () => {
    Online.RemoveOnlineUser(socket.username);
  });

  socket.on("disconnect", () => {
    console.log("Disconnected!");
  });

  //Game Lobby listeners
  socket.on(CREATE_GAME, (username, callback) => {
    const lobbyId = uuidv4();
    Games.CreateGame(username, lobbyId)
	    .then( () => {
	        socket.leave(socket.lobbyId);
	        socket.join(lobbyId);
	        socket.lobbyId = lobbyId;
	        console.log("Game Created: " + socket.lobbyId);
	        callback(socket.lobbyId);
	        Online.SetUserLocation(username,lobbyId)
	      })
	    .catch(()=>{
	    })
  });

  socket.on(JOIN_GAME, (id, callback) => {
  	console.log("User has request to join a game")
    Games.JoinGame(socket.username, id)
	    .then (game=>{
      if (game) {
        socket.leave(socket.lobbyId);
        socket.join(id);
        socket.lobbyId = id;
        io.to(socket.id).emit(
          RECEIVE_MESSAGE,
          systemMessage("Joining game with ID: " + id, uuidv4())
        );
        socket.to(socket.lobbyId)
          .emit(
            RECEIVE_MESSAGE,
            systemMessage(socket.username + " has joined the game!", uuidv4())
          );
        socket.to(socket.lobbyId).emit(USER_JOINED_HOSTS_GAME, socket.username);
        console.log("User: " + socket.username + "joined game: " + id);
        Online.SetUserLocation(socket.username,id)
        callback(true);
      } else {
        io.to(socket.id).emit(
          RECEIVE_MESSAGE,
          systemMessage("Game is no longer available", uuidv4())
        );
        callback(false);
      }
    });
  });

  socket.on(REFRESH_LOBBY, callback => {
    console.log("REC REF LOB REQ");
    Games.GetLobby()
	    .then(results=> {

	    		console.log("Lobby Games: " + util.inspect(results,{showHidden: false, depth: null}));

		    callback(results)
	    });

    });


  //Checker's game listeners
  socket.on(MAKE_MOVE, (fromX, fromY, toX, toY) => {
    socket.to(socket.lobbyId).emit(RECEIVE_MOVE, fromX, fromY, toX, toY);
  });

  socket.on(END_GAME, () => {
    //TODO
  });

  //Chat listeners
  socket.on(SEND_MESSAGE, (message, callback) => {
    const genId = uuidv4();

    if (message.charAt(0) === "/") {
      //Command initiated
      let messageArray = message.split(" ");
      messageArray = messageArray.filter(m => m !== "");
      console.log("Command rec: " + messageArray);

      if (messageArray[0].toLowerCase() === "/w") {
        //Sends private message
        if (!messageArray[1]) {
          callback(systemMessage("No username given", genId));
        } else if (!messageArray[2]) {
          callback(systemMessage("No message given", genId));
        } else {
          const toUser = messageArray[1];
          const pm = messageArray.slice(2, messageArray.length + 1).join(" ");
          const toSender = privateMessage(socket.username, toUser, pm, genId);
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
        callback(toSender);
      } else if (messageArray[0].toLowerCase() === "/stats") {
        if (!messageArray[1]) {
          callback(systemMessage("No username given", genId));
        } else {
          const userName = messageArray[1];
          Users.IsUserMember(userName)
	          .then((result)=>
	        {
		        if (result) {
			        Users.GetStats(userName)
				        .then((results)=>{
				        const {total_games, wins, total_kings, ranking} = results;
					        const message =
						        "Stats for User: " +
						        userName +
						        " Ranking: " +
						        ranking +
						        " Total Games: " +
						        total_games +
						        " Wins: " +
						        wins +
						        " Total Times Kinged: " +
						        total_kings;
					        callback(systemMessage(message, genId));
				        }
			        );
		        } else {
			        callback(systemMessage("No such user found", genId));
		        }
	        });
        }
      } else {
        const toSender = systemMessage(
          messageArray[0] + " is not a valid command",
          genId
        );
        callback(toSender);
      }
    } else {
      //sends message to current lobby
      const recMessage = {
        id: genId,
        userName: socket.username,
        message: message,
        color: "#FFFFFF"
      };
      const toSender = {
        id: genId,
        userName: socket.username,
        message: message,
        color: "#ffa700"
      };
      socket.to(socket.lobbyId).emit(RECEIVE_MESSAGE, recMessage);
      callback(toSender);
      console.log(
        "Message passed: " + message + " to lobby: " + socket.lobbyId
      );
    }
  });
};

/*helper methods*/
function privateMessage(fromUser, toUser, pm, genId) {
  if (Online.IsUserOnline(toUser)) {
    const messageOut = {
      id: genId,
      userName: "PM from " + fromUser,
      message: pm,
      color: "#0e495f"
    };
    io.to(toUser).emit(RECEIVE_MESSAGE, messageOut);
    return {
      id: genId,
      userName: "PM to " + toUser,
      message: pm,
      color: "#ffe267"
    };
  } else {
    console.log("User not found for PM: " + toUser);
    return systemMessage("The user: " + toUser + " is not online", genId);
  }
}

function systemMessage(message, genId) {
  const output = {
    id: genId,
    userName: "SYSTEM",
    message: message,
    color: "#FF0000"
  };
  console.log("System Message: " + output.message + "message Id: " + output.id);
  return output;
}

function calculateRank(p1, p2, isWinner) {
  Users.GetStats(p1)
    .then(results => {
      const { ranking, total_games } = results;
      const k = total_games < 30 ? 40 : ranking < 2400 ? 20 : 10;
      Users.GetStats(p2)
        .then(r2 => {
          const prob1 = rankProbability(ranking, r2.ranking);
          const prob2 = rankProbability(r2.ranking, ranking);
          return isWinner ? p2 + k * (1 - prob1) : p2 + k * (0 - prob2);
        })
        .then(o => o);
    })
    .then(f => f);
}

function rankProbability(rating1, rating2) {
  return 1.0 / (1.0 + Math.pow(10, (rating1 - rating2) / 400));
}

