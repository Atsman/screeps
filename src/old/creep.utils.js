function isFull(creep) {
  return creep.carry.energy === creep.carryCapacity;
}

function isEmpty(creep) {
  return creep.carry.energy === 0;
}

function goToClosestSource(creep) {
  const source = creep.pos.findClosestByPath(FIND_SOURCES);
  if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
    creep.moveTo(source);
  }
}

module.exports = {
  isFull,
  isEmpty,
  goToClosestSource,
};
