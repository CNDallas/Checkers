const Sequelize = require("sequelize");
const sequelize = require("../database.js");

const Games = sequelize.define("games", {
  idgames: {
	  type: Sequelize.INTEGER,
	  primaryKey: true,
	  autoIncrement: true,
	  unique: true
  },
  host_username: {
    type: Sequelize.STRING(16),
    allowNull: false,
  },
  opponent_username: {
    type: Sequelize.STRING(16),
    allowNull: true
  },
  is_open: {
    type: Sequelize.INTEGER(4),
    allowNull: false,
    defaultValue: "1"
  },
  lobby_id: {
    type: Sequelize.STRING(45),
    allowNull: true,
    unique: true
  }
});

module.exports = Games;
