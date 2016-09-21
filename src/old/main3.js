var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepair = require('role.repairer');

const { activateSafeMode } = require('room.utils');

const ROOM_NAME = 'E27S55';

const HARVESTER = 'harvester';
const UPGRADER  = 'upgrader';
const BUILDER = 'builder';
const REPAIRER = 'repairer';

const ROLES = [HARVESTER, UPGRADER, BUILDER, REPAIRER];

function groupCreepsByRole() {
  return _.groupBy(Game.creeps, (creep) => creep.memory.role);
}

function createHarvester() {
  return Game.spawns['Spawn1'].createCreep([WORK, CARRY, MOVE], undefined, { role: HARVESTER });
}

function createUpgrader() {
  return Game.spawns['Spawn1'].createCreep([WORK, CARRY, MOVE], undefined, { role: UPGRADER });
}

function createBuilder() {
  return Game.spawns['Spawn1'].createCreep([WORK, CARRY, MOVE], undefined, { role: BUILDER });
}

function createRepairer() {
  return Game.spawns['Spawn1'].createCreep([WORK, CARRY, MOVE], undefined, { role: REPAIRER });
}

function getCreepFactory(role) {
  switch (role) {
    case HARVESTER: return createHarvester;
    case UPGRADER: return createUpgrader;
    case BUILDER: return createBuilder;
    case REPAIRER: return createRepairer;
  }
}

const numberOfUnits = {
  [HARVESTER]: 4,
  [UPGRADER]: 2,
  [BUILDER]: 4,
  [REPAIRER]: 2
}

function getCreepRoleAction(role) {
  switch(role) {
    case HARVESTER: return roleHarvester;
    case UPGRADER: return roleUpgrader;
    case BUILDER: return roleBuilder;
    case REPAIRER: return roleRepair;
  }
}

module.exports.loop = function() {
  for (var name in Memory.creeps) {
    if (!Game.creeps[name]) {
      delete Memory.creeps[name];
      console.log('Clearing non-existing creep memory:', name);
    }
  }

  const creepGroups = groupCreepsByRole();

  _.each(ROLES, (role) => {
    const creeps = creepGroups[role];
    console.log('Group: ' + role + ', units: ' + (creeps ? creeps.length : 0));
    if (!creeps || creeps.length < numberOfUnits[role]) {
      const newCreepsName = getCreepFactory(role)();
      console.log('Spawning: ' + role + ', name: ' + name);
    }

    const action = getCreepRoleAction(role);
    _.each(creeps, (creep) => {
      action(creep);
    });
  });

  //Game.creeps['yo'].moveTo(33, 49)
}