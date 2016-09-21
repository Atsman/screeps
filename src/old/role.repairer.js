const cutils = require('creep.utils');
const utils = require('utils');

const SECURITY_STRUCTURES = [STRUCTURE_WALL, STRUCTURE_RAMPART];

function isSecurityStructure(structureType) {
  return _.includes(SECURITY_STRUCTURES, structureType);
}

function findClosestStrWhichNeedRepair(pos) {
  return pos.findClosestByPath(FIND_STRUCTURES, {
    filter: (obj) => {
      if (isSecurityStructure(obj.structureType)) {
        return obj.hits < 30000;
      }
      return obj.hits < obj.hitsMax - 100;
    }
  });
}

function findClosestConstructionSites(pos) {
  return pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
}

function findClosestSource(pos) {
  return pos.findClosestByPath(FIND_SOURCES);
}

module.exports = function (creep) {
  if (creep.memory.repairing && cutils.isEmpty(creep)) {
    creep.memory.repairing = false;
  }

  if (!creep.memory.repairing && cutils.isFull(creep)) {
    creep.memory.repairing = true;
  }

  if (creep.memory.repairing) {
    const str = findClosestStrWhichNeedRepair(creep.pos);
    if (str) {
      creep.say('Repairing!');
      if (creep.repair(str) === ERR_NOT_IN_RANGE) {
        creep.say('Going to structure');
        creep.moveTo(str);
      }
    } else {
      const target = findClosestConstructionSites(creep.pos);
      if (target) {
        creep.moveTo(target);
        if (creep.build(target) == ERR_NOT_IN_RANGE) {
          creep.moveTo(target);
        }
      }
    }
  } else {
    cutils.goToClosestSource(creep);
  }
}
