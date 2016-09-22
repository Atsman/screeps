const config = require('../config');

let rooms;
let roomNames = [];

function loadRooms() {
  rooms = Game.rooms;
  roomNames = _.keys(Game.rooms);

  if (config.VERBOSE) {
    console.log(`${roomNames.length} rooms found.`);
  }
}

function getFirstRoom() {
  return rooms[roomNames[0]];
}

export const RoomManager = {
  init: loadRooms,
  getFirstRoom,
};
