const roleUpgrader = require('role.upgrader');
const cutils = require('creep.utils');

const CHARGING_STRUCTURES = [STRUCTURE_EXTENSION, STRUCTURE_SPAWN, STRUCTURE_TOWER];

function isChargingStructure(structureType) {
  return _.includes(CHARGING_STRUCTURES, structureType);
}

function goToClosestSource(creep) {
  const source = creep.pos.findClosestByPath(FIND_SOURCES);
  if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
    creep.moveTo(source);
  }
}

function findWornStructures(room) {
  return room.find(FIND_STRUCTURES, {
    filter: (structure) => {
      return (isChargingStructure(structure.structureType))
        && structure.energy < structure.energyCapacity;
    }
  });
}

module.exports = function (creep) {
  if (creep.memory.charging && cutils.isEmpty(creep)) {
    creep.memory.charging = false;
  }

  if (!creep.memory.charging && cutils.isFull(creep)) {
    creep.memory.charging = true;
  }

  if (creep.memory.charging) {
    const targets = findWornStructures(creep.room);
    if (targets.length > 0) {
      if (creep.transfer(targets[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        creep.moveTo(targets[0]);
      }
    } else {
      roleUpgrader(creep);
    }
  } else {
    goToClosestSource(creep);
  }
}
