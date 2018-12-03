/* starts up the function to handle socket events */

const express = require("express");
const app = express();
const server = require("http").Server(app);
const path = require("path");
const Sequelize = require("sequelize");
const io = module.exports.io = require('socket.io')(server)

const PORT = 8081;
app.use(express.static(path.join("../../../build")));
app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname + "../../../build/index.html"));
});
const SocketManager = require("./SocketManager.js");

io.on("connection", SocketManager);



const sequelize = require("./database.js");


// const Users = sequelize.import('./modules/users.js');
// const Online_Users = sequelize.import('./modules/online_users.js');
// const Games = sequelize.import('./modules/games.js');
// Online_Users.belongsTo(Users, {constraints: true, onDelete: "CASCADE" });
sequelize
  .sync()
  .then(results => {

    //TODO remove force when deploying
    server.listen(PORT, "0.0.0.0", function() {
      console.log("Connected");
    });
  })
  .catch(err => {
    console.log("Sequelize Error ind server: " + err);
  });


//TODO once we get closer to end developement. Add more security and attack prevention. Such as domain checks or using https.
//TODO Also set up a PORT looking for the environment variable and finally add more error checking and reporting
