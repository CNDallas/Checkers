const Users = require("./users.js");

exports.UpdateRank = (userName, rankChange) => {
  Users.findOne({
    attributes: { include: ["ranking"] },
    where: { username: userName }
  })
    .then(user => {
      user.ranking += rankChange;
      user.save();
    })
    .then(() => {
	    console.log("UpdateRanking is done");
    })
    .catch(err => {
      console.log("UpdateRank err:" + err);
    });
};

exports.GetStats = username => {
	return new Promise(resolve => {
		Users.findOne({
			attributes: {include: ["wins", "total_games", "total_kings", "ranking"]},
			where: {username}
		})
			.then(stats => {
				console.log("GetStats Results");
				resolve(stats);
			})
			.catch(err => {
				console.log("GetStats err:" + err);
			});
	})
};

exports.IsUserMember = userName => {
	return new Promise(resolve => {
		Users.findOne({
			where: {username: userName}
		})
			.then(r => {
				console.log("IsUserMember: Result" + r);
				resolve(r !== null);
			})
			.catch(err => {
				console.log("IsUserMember: err:" + err);
			});
	});
};

exports.AddWin = userName => {
  Users.findAll({
    where: { username: userName }
  })
    .then(user => {
      user.wins++;
      return user.save();
    })
    .then(() => {
      console.log("AddWin Results");
    })
    .catch(err => {
      console.log("AddWin err:" + err);
    });
};

exports.AddGameTotal = userName => {
  Users.findAll({
    where: { username: userName }
  })
    .then(user => {
      user.total_games++;
      return user.save();
    })
    .then(() => {
      console.log("AddGameTotal Results");
    })
    .catch(err => {
      console.log("AddGameTotal err:" + err);
    });
};

exports.AddKing = userName => {
  Users.findAll({
    where: { username: userName }
  })
    .then(user => {
      user.total_kings++;
      return user.save();
    })
    .then(() => {
      console.log("AddKing Results");
    })
    .catch(err => {
      console.log("AddKing err:" + err);
    });
};
