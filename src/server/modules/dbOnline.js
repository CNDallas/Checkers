const Online_Users = require("./online_users.js");

exports.IsUserOnline = (userName, sessionId) => {
	return new Promise((resolve, reject) => {
		Online_Users.findOne({
			where: {username: userName} //For now there is no verification that they are an imposter add this to the the where when there issession_id: sessionId
		})
			.then((user) => {
				console.log("IsUserOnline:" + !!user);
				resolve(!!user);

			})
			.catch(err => {
				console.log("IsUserOnline: err:" + err);
				reject(err);
			})
	})
};

exports.AddOnlineUser = (userName, sessionId, socketId) => {
	return new Promise ((resolve, reject) =>
	{
		Online_Users.create({
			username: userName,
			session_id: sessionId,
			socket_id: socketId,
			location: "dashboard"
		})
			.then(() => {
				console.log("AddOnlineUser");
				resolve();
			})
			.catch(err => {
				console.log("AddOnlineUser: err:" + err);
				reject(err);
			});
	})
};

exports.RemoveOnlineUser = (userName) =>
	{
		Online_Users.findOne({
			where: {userName}
		})
			.then(user => {
				user.destroy();
			})
			.then(() => {
				console.log("RemoveUser Results");
			})
			.catch(err => {
				console.log("RemoveUser err:" + err);
			});

}

exports.GetUserLocation = userName => {
	return new Promise(resolve => {
		Online_Users.findOne({
			where: {username: userName}
		})
			.then(online_users => {
				console.log("GetUserLocation: Result: " + online_users.location);
				resolve(online_users.location);
			})
			.catch(err => {
				console.log("GetUserLocation: err:" + err);
			});
	})
}

exports.SetUserLocation = (userName,location) => {
		Online_Users.findOne({
			where: {username: userName}
		})
			.then(user => {
				user.location = location;
				console.log("SetUserLocation: Result: " + user.location);
				user.save();
			})
			.catch(err => {
				console.log("GetUserLocation: err:" + err);
			});
}
