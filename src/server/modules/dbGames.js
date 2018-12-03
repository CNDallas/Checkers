const Games = require("./games.js");
const Users = require("./users.js");

exports.GetLobby = () => {
	return new Promise(resolve => {
		console.log("GETTING LOBBY");
		Games.findAll({
			attributes: ["host_username", "lobby_id"],
			where: {is_open: true},
			raw: true
		})
			.then( games => {


			const promises = [];

				for(let i = 0; i < games.length; i++) {
					const o = Users.findOne({
						attributes: ["total_games", "wins", "total_kings", "ranking"],
						where: {username: games[i].host_username},
						raw: true
					}).then(r => {
						games[i] = {...games[i], ...r}
					})
					promises.push(o);
				}
				console.log(promises)
				Promise.all(promises)
					.then(results => {
						console.log(games);
						resolve(games);
					})
					.catch(err => {
						console.log("GetLobby err:" + err);
					});
			})
	})
}


exports.OpponentLookUp = (userName, LobbyId) => {
	return new Promise(resolve => {
		Games.findOne({
			attributes: {include: ["host_username", "opponent_username"]},
			where: {lobby_id: LobbyId}
		})
			.then(games => {
				console.log("OpponentLookUp: Result");
				if (userName.equals(games.host_username)) {
					resolve(games.opponent_username);
				}
				resolve(games.opponent_username);
			})
			.catch(err => {
				console.log("OpponentLookUp: err:" + err);
			});
	});
};

exports.CreateGame = (username, lobbyId) => {
  return new Promise((resolve,reject) => {
	  Games.create({
		  host_username: username,
		  lobby_id: lobbyId
	  })
		  .then( () => {
			  console.log("CreateGame: Result");
			  resolve();
		  })
		  .catch(err => {
			  console.log("CreateGame: err:" + err);
			  reject();
		  });
  });
};


exports.JoinGame = (username, lobbyId) => {
	return new Promise(resolve => {
		Games.findOne({
			where: {lobby_id: lobbyId, is_open: true}
		})
			.then(games => {
				if (games != null) {
					games.opponent_username = username;
					games.is_open = false;
					games.save();
					resolve(true);
				} else {
					resolve(false);
				}
			})
			.catch(err => {
				console.log("JoinGame err:" + err);
			});
	})
};

exports.RemoveGame = lobbyId => {
  Games.findOne({
    where: { lobby_id: lobbyId }
  })
    .then(games => {
      games.destroy();
    })
    .then(() => {
      console.log("RemoveGame Results");
    })
    .catch(err => {
      console.log("RemoveGame err:" + err);
    });
};

exports.GetAllGames = () => {
  Games.findAll({
    attributes: { exclude: "idgames" }
  })
    .then(games => {
      console.log("GetAllGames Results");
      return games;
    })
    .catch(err => {
      console.log("GetAllGames err:" + err);
    });
};
