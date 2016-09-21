function activateSafeMode(roomName) {
  const room = Game.rooms[roomName];
  if (room) {
    room.controller.activateSafeMode();
  }
}

module.exports = {
  activateSafeMode,
};
