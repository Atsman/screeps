import config from '../config';
import { ROLES } from '../constants';
import { SourceManager } from '../sources/source.manager';
import { Harvester } from './harvester';
import { SpawnManager } from '../spawns/spawn.manager';

let creeps;
let creepNames;
let creepCount;

function loadCreeps() {
  creeps = Game.creeps;
  creepNames = _.keys(Game.creeps);
  creepCount = creepNames.length;

  if (config.VERBOSE) {
    console.log(`${creepCount} creeps found.`);
  }
}

function createHarvester() {
  const bodyParts = [MOVE, MOVE, CARRY, WORK];
  const name = undefined;
  const props = {
    renew_station_id: SpawnManager.getFirstSpawn().id,
    role: ROLES.HARVESTER,
    target_energy_dropoff_id: SpawnManager.getFirstSpawn().id,
    target_source_id: SourceManager.getFirstSource().id,
  };

  let status = SpawnManager.getFirstSpawn().canCreateCreep(bodyParts, name);
  if (status === OK) {
    status = SpawnManager.getFirstSpawn().createCreep(bodyParts, name, props);
    if (config.VERBOSE) {
      console.log('started creating new HARVESTER');
    }
  }
  return status;
}

function harvestersGoToWork() {
  let harvestersCount = 0;
  _.forEach(creeps, (creep) => {
    if (creep.memory.role === ROLES.HARVESTER) {
      const harvester = new Harvester();
      harvester.setCreep(creep);
      harvester.action();
      harvestersCount += 1;
    }
  });

  if (config.VERBOSE) {
    console.log(harvestersCount + ' harvesters reported.');
  }
}

function isHarvesterLimitFull() {
  return config.MAX_HARVESTERS_PER_SOURCE === creepCount;
}
