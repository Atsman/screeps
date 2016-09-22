import config from './config';
import { MemoryManager } from './shared';
import { creepStore } from './creeps/creep.store';
import { RoomManager } from './rooms/room.manager';
import { SpawnManager } from './spawns/spawn.manager';
import { SourceManager } from './sources/source.manager';
import { CreepManager } from './creeps/creep.manager';

MemoryManager.init();
RoomManager.init();
SpawnManager.init();
SourceManager.init();

if (config.USE_PATHFINDER) {
  PathFinder.use(true);
}

function clearMemory() {
  _.forEach(Memory.creeps, (creep, name) => {
    if (!Game.creeps[name]) {
      delete Memory.creeps[name];
      console.log('Clearing non-existing creep memory:', name);
    }
  });
}

module.exports.loop = () => {
  clearMemory();

  creepStore.initialize();

  CreepManager.loadCreeps();

  if (!CreepManager.isHarvesterLimitFull()) {
    console.log('harvesters not enought!');
    CreepManager.createHarvester();
  } else {
    if (!CreepManager.isBuilderLimitFull()) {
      CreepManager.createBuilder();
    }

    if (!CreepManager.isUpgradersLimitFull()) {
      CreepManager.createUpgrader();
    }

    if (!CreepManager.isRepairersLimitFull()) {
      CreepManager.createRepairer();
    }
  }

  CreepManager.creepsGoToWork();
};
