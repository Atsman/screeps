import config from './config';
import { MemoryManager } from './shared';

import { RoomManager } from './rooms/room.manager';
import { SpawnManager } from './spawns/spawn.manager';
import { SourceManager } from './sources/source.manager';
import { CreepManager } from './creeps/creep.manager';

MemoryManager.loadMemory();
RoomManager.loadRooms();
SpawnManager.loadSpawns();
SourceManager.loadSources();

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

  CreepManager.loadCreeps();

  if (!CreepManager.isHarvesterLimitFull()) {
    CreepManager.createHarvester();
  }

  if (!CreepManager.isBuilderLimitFull()) {
    CreepManager.createBuilder();
  }

  if (!CreepManager.isUpgradersLimitFull()) {
    CreepManager.createUpgrader();
  }

  CreepManager.creepsGoToWork();
};
