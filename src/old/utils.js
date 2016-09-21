const { ROOM_NAME } = require('config');

function getCurrentRoom() {
  return Game.rooms[ROOM_NAME];
}

module.exports = {
  getCurrentRoom,
}
