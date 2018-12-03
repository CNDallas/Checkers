/* starts up the function to handle socket events */

const express = require("express");
const app = express();
const server = require("http").Server(app);
const path = require("path");
const Sequelize = require("sequelize");
const io = module.exports.io = require('socket.io')(server)

const PORT = 8081;
app.use(express.static(path.join(__dirname+"../../../build")));
// app.get("/", function(req, res) {
//   res.sendFile(path.join(__dirname + "../../../build/index.html"));
// });
// app.get("/*", function(req, res) {
// 	res.sendFile(path.join(__dirname + "../../../build/*"));
//});
const SocketManager = require("./SocketManager.js");

io.on("connection", SocketManager);



const sequelize = require("./database.js");

sequelize
  .sync()
  .then(() => {
    server.listen(PORT, function() {
      console.log("Connected");
    });
  })
  .catch(err => {
    console.log("Sequelize Error ind server: " + err);
  });


//TODO once we get closer to end developement. Add more security and attack prevention. Such as domain checks or using https.
//TODO Also set up a PORT looking for the environment variable and finally add more error checking and reporting
