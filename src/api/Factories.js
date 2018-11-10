const uuid = require("uuid");

/** This is where all the functions go that create objects that will be shared with the rest of the players**/

/**Creates a user with an almost certainly unique UUID**/
const createUser = ({ username = "", socketId = null } = {}) => ({
  id: uuid(),
  username,
  socketId
});

const createGame = ({ message = "", sender = "" } = {}) => ({
  id: uuid(),

  message,
  sender
});
