import config from '../config';
import { ROLES } from '../constants';
import { SourceManager } from '../sources/source.manager';
import { Harvester } from './harvester';
import { Builder } from './builder';
import { Upgrader } from './upgrader';
import { Repairer } from './repairer';
import { SpawnManager } from '../spawns/spawn.manager';
import { MemoryManager } from '../shared';
import { creepStore } from './creep.store';

import { MOVE, CARRY, WORK, OK, ERR_BUSY } from '../screeps.globals';

export function calculateHarvestersPerSource(harvesters) {
  return _.reduce(harvesters, (acc, harvester) => {
    const sourceId = harvester.memory.target_source_id;
    if (_.isNumber(acc[sourceId])) {
      acc[sourceId] += 1;
    } else {
      acc[sourceId] = 1;
    }
    return acc;
  }, {});
}

function loadCreeps() {
  if (config.VERBOSE) {
    console.log(`${creepStore.getCreepCount()} creeps found.`);
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

function findSourceWithNotEnoughtHarvesters(sources, sourceCreepsCountMap) {
  return _.find(
    sources,
    s => !sourceCreepsCountMap[s.id] || sourceCreepsCountMap[s.id] < config.MAX_HARVESTERS_PER_SOURCE
  );
}

function createHarvester() {
  const bodyParts = [MOVE, CARRY, WORK];
  const name = undefined;
  const sourceCreepsCountMap = calculateHarvestersPerSource(creepStore.getHarvesters());
  const source = findSourceWithNotEnoughtHarvesters(SourceManager.getActiveSources(), sourceCreepsCountMap);

  if (source) {
    const props = {
      renew_station_id: SpawnManager.getFirstSpawn().id,
      role: ROLES.HARVESTER,
      target_energy_dropoff_id: SpawnManager.getFirstSpawn().id,
      target_source_id: source.id,
    };

    return createCreep(bodyParts, name, props);
  }

  console.log('createHarvester - source not found');

  return false;
}

function createBuilder() {
  const bodyParts = [MOVE, CARRY, WORK];
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

function createRepairer() {
  const bodyParts = [MOVE, MOVE, CARRY, WORK];
  const name = undefined;
  const props = {
    renew_station_id: SpawnManager.getFirstSpawn().id,
    role: ROLES.REPAIRER,
  };
  return createCreep(bodyParts, name, props);
}

function creepsGoToWork() {
  _.each(creepStore.getCreepNames(), (creepName) => {
    const creep = Game.creeps[creepName];
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
    }

    if (creep.memory.role === ROLES.UPGRADER) {
      if (!creep.memory.renew_station_id) {
        creep.memory.renew_station_id = SpawnManager.getFirstSpawn().id;
      }

      const upgrader = new Upgrader(creep);
      upgrader.action();
    }

    if (creep.memory.role === ROLES.REPAIRER) {
      if (!creep.memory.renew_station_id) {
        creep.memory.renew_station_id = SpawnManager.getFirstSpawn().id;
      }

      const repairer = new Repairer(creep);
      repairer.action();
    }
  });

  if (config.VERBOSE) {
    console.log(`${creepStore.getHarvesters().length} harvesters`);
    console.log(`${creepStore.getBuilders().length} builders`);
    console.log(`${creepStore.getUpgraders().length} upgraders`);
    console.log(`${creepStore.getRepairers().length} repairers`);
  }
}

function isHarvesterLimitFull() {
  return creepStore.getHarvesters().length >=
    config.MAX_HARVESTERS_PER_SOURCE * SourceManager.getActiveSources().length;
}

function isBuilderLimitFull() {
  return creepStore.getBuilders().length >= 4;
}

function isUpgradersLimitFull() {
  return creepStore.getUpgraders().length >= 1;
}

function isRepairersLimitFull() {
  return creepStore.getRepairers().length >= 3;
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
  getHarvesters: creepStore.getHarvesters.bind(creepStore),
  isRepairersLimitFull,
  createRepairer,
};
