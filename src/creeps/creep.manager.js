import config from '../config';
import { ROLES } from '../constants';
import { SourceManager } from '../sources/source.manager';
import { Harvester } from './harvester';
import { Builder } from './builder';
import { Upgrader } from './upgrader';
import { SpawnManager } from '../spawns/spawn.manager';
import { MemoryManager } from '../shared';

import { MOVE, CARRY, WORK, OK, ERR_BUSY } from '../screeps.globals';

let creeps = Game.creeps;
let creepNames;
let creepCount;

let harvestersCount = 0;
let buildersCount = 0;
let upgradersCount = 0;

function getHarvesters() {
  return _.filter(
    creeps,
    creep => creep.memory.role === ROLES.HARVESTER
  );
}

function loadCreeps() {
  creeps = Game.creeps;
  creepNames = _.keys(Game.creeps);
  creepCount = creepNames.length;

  const sourceCreepsMap = {};

  const sourceIds = getHarvesters().map(creep => creep.memory.target_source_id);

  const sourceIdMap = _.reduce(sourceIds, (acc, id) => {
    if (_.isNumber(acc[id])) {
      acc[id] += 1;
    } else {
      acc[id] = 1;
    }
    return acc;
  }, {});

  const msources = MemoryManager.getMemory().sources;
  _.each(msources, (msource) => {
    const currentCount = sourceIdMap[msource.id];
    msources[msource.id].creepsCount = currentCount;
  });

  if (config.VERBOSE) {
    console.log(`${creepCount} creeps found.`);
  }
}

function createCreep(bodyParts, name, props) {
  let status = SpawnManager.getFirstSpawn().canCreateCreep(bodyParts, name);
  if (status === OK) {
    status = SpawnManager.getFirstSpawn().createCreep(bodyParts, name, props);
    if (config.VERBOSE) {
      console.log(`started role:${props.role}`);
    }
  }
  return status;
}

function createHarvester() {
  const bodyParts = [MOVE, MOVE, CARRY, WORK];
  const name = undefined;

  const msources = MemoryManager.getMemory().sources;
  const sources = SourceManager.getActiveSources();

  const msource = _.find(msources, source => source.creepsCount < config.MAX_HARVESTERS_PER_SOURCE);

  if (msource) {
    const props = {
      renew_station_id: SpawnManager.getFirstSpawn().id,
      role: ROLES.HARVESTER,
      target_energy_dropoff_id: SpawnManager.getFirstSpawn().id,
      target_source_id: msource.id,
    };

    const status = createCreep(bodyParts, name, props);
    if (status === ERR_BUSY) {
      msources[msource.id].creepsCount += 1;
    }
    return status;
  }

  return false;
}

function createBuilder() {
  const bodyParts = [MOVE, MOVE, CARRY, WORK];
  const name = undefined;
  const props = {
    renew_station_id: SpawnManager.getFirstSpawn().id,
    role: ROLES.BUILDER,
  };

  return createCreep(bodyParts, name, props);
}

function createUpgrader() {
  const bodyParts = [MOVE, MOVE, CARRY, WORK];
  const name = undefined;
  const props = {
    renew_station_id: SpawnManager.getFirstSpawn().id,
    role: ROLES.UPGRADER,
  };
  return createCreep(bodyParts, name, props);
}

function creepsGoToWork() {
  let hCount = 0;
  let bCount = 0;
  let uCount = 0;
  _.each(creepNames, (creepName) => {
    const creep = creeps[creepName];
    if (creep.memory.role === ROLES.HARVESTER) {
      if (!creep.memory.renew_station_id) {
        creep.memory = {
          renew_station_id: SpawnManager.getFirstSpawn().id,
          role: ROLES.HARVESTER,
          target_energy_dropoff_id: SpawnManager.getFirstSpawn().id,
          target_source_id: SourceManager.getFirstSource().id,
        };
      }
      const harvester = new Harvester(creep);
      harvester.action();
      hCount += 1;
    }

    if (creep.memory.role === ROLES.BUILDER) {
      if (!creep.memory.renew_station_id) {
        creep.memory = {
          renew_station_id: SpawnManager.getFirstSpawn().id,
          role: ROLES.BUILDER,
        };
      }
      const builder = new Builder(creep);
      builder.action();
      bCount += 1;
    }

    if (creep.memory.role === ROLES.UPGRADER) {
      if (!creep.memory.renew_station_id) {
        creep.memory.renew_station_id = SpawnManager.getFirstSpawn().id;
      }

      const upgrader = new Upgrader(creep);
      upgrader.action();
      uCount += 1;
    }
  });

  harvestersCount = hCount;
  buildersCount = bCount;
  upgradersCount = uCount;

  if (config.VERBOSE) {
    console.log(`${harvestersCount} harvesters`);
    console.log(`${buildersCount} builders`);
    console.log(`${upgradersCount} upgraders`);
  }
}

function isHarvesterLimitFull() {
  return harvestersCount >= config.MAX_HARVESTERS_PER_SOURCE * SourceManager.getActiveSources().length;
}

function isBuilderLimitFull() {
  return buildersCount >= 4;
}

function isUpgradersLimitFull() {
  return upgradersCount >= 1;
}

export const CreepManager = {
  loadCreeps,
  createHarvester,
  createBuilder,
  createUpgrader,
  creepsGoToWork,
  isHarvesterLimitFull,
  isBuilderLimitFull,
  isUpgradersLimitFull,
  getHarvesters,
};
