import config from './config';
import MemoryManager from './shared';

const RoomManager = require('./rooms/room.manager');
const SpawnManager = require('./spawns/spawn.manager');
const SourceManager = require('./sources/source.manager');
const CreepManager = require('./creeps/creep.manager');

RoomManager.loadRooms();
SpawnManager.loadSpawns();
SourceManager.loadSources();

if (config.USE_PATHFINDER) {
  PathFinder.use(true);
}

module.exports.loop = () => {
  MemoryManager.loadMemory();
  CreepManager.loadCreeps();

  if (!CreepManager.isHarvesterLimitFull()) {
    CreepManager.createHarvester();
  }

  CreepManager.harvestersGoToWork();
};
