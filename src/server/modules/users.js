const Sequelize = require("sequelize");
const sequelize = require("../database");

const Users = sequelize.define("users", {
  idusers: {
	  type: Sequelize.INTEGER,
	  primaryKey: true,
	  autoIncrement: true,
  },
  username: {
    type: Sequelize.STRING(16),
    allowNull: false,
    unique: true
  },
  password: {
    type: Sequelize.STRING(80),
    allowNull: false
  },
  email: {
    type: Sequelize.STRING(80),
    allowNull: false,
    unique: true
  },
  total_games: {
    type: Sequelize.INTEGER(10).UNSIGNED,
    allowNull: false,
    defaultValue: "0"
  },
  wins: {
    type: Sequelize.INTEGER(10).UNSIGNED,
    allowNull: false,
    defaultValue: "0"
  },
  total_kings: {
    type: Sequelize.INTEGER(10).UNSIGNED,
    allowNull: false,
    defaultValue: "0"
  },
  ranking: {
    type: Sequelize.INTEGER(10).UNSIGNED,
    allowNull: false,
    defaultValue: "1500"
  }

});

module.exports = Users;
