const cutils = require('creep.utils');

module.exports = function runUpgrader(creep) {
  if (creep.memory.upgrading && cutils.isEmpty(creep)) {
    creep.memory.upgrading = false;
    creep.say('harvesting');
  }
  if (!creep.memory.upgrading && cutils.isFull(creep)) {
    creep.memory.upgrading = true;
    creep.say('upgrading');
  }
  if (creep.memory.upgrading) {
    if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
      creep.moveTo(creep.room.controller);
    }
  } else {
    const source = creep.room.find(FIND_SOURCES)[0];
    if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
      creep.moveTo(source);
    }
  }
}
