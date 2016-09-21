import config from '../config';

let spawns;
let spawnCount;
let spawnNames = [];

function loadSpawns() {
  spawns = Game.spawns;
  spawnCount = _.size(spawns);
  spawnNames = _.keys(spawns);

  if (config.VERBOSE) {
    console.log(`${spawnCount} spawns in room.`);
  }
}

function getFirstSpawn() {
  return spawns[spawnNames[0]];
}

export const SpawnManager = {
  loadSpawns,
  getFirstSpawn,
};

