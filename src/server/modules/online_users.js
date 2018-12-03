const Sequelize = require("sequelize");
let sequelize = require("../database.js");

const Online_Users = sequelize.define("online_users", {
  idonline_users: {
	  type: Sequelize.INTEGER,
	  primaryKey: true,
	  autoIncrement: true,
  },
  username: {
    type: Sequelize.STRING(16),
    allowNull: false,
    unique: true
  },
  location: {
    type: Sequelize.STRING(255),
    allowNull: false,
  },
  session_id: {
    type: Sequelize.STRING(255),
    allowNull: false,
    unique: true
  },
  socket_id: {
    type: Sequelize.STRING(255),
    allowNull: false,
    unique: true
  }
});

module.exports = Online_Users;
