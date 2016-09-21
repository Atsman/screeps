const cutils = require('creep.utils');

module.exports = function(creep) {
  if (creep.memory.building && cutils.isEmpty(creep)) {
    creep.memory.building = false;
  }
  if (!creep.memory.building && cutils.isFull(creep)) {
    creep.memory.building = true;
  }

  if (creep.memory.building) {
    const target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
    if (target) {
      creep.moveTo(target);
      if (creep.build(target) === ERR_NOT_IN_RANGE) {
        creep.moveTo(target);
      }
    }
  }
  else {
    cutils.goToClosestSource(creep);
  }
}
