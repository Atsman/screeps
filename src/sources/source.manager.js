import config from '../config';
import { RoomManager } from '../rooms/room.manager';
import { MemoryManager } from '../shared';
import { FIND_SOURCES_ACTIVE } from '../screeps.globals';

let sources;
let sourceCount;

function loadSources() {
  sources = RoomManager.getFirstRoom().find(FIND_SOURCES_ACTIVE);
  sourceCount = _.size(sources);

  const memory = MemoryManager.getMemory();
  memory.sources = {};

  _.forEach(sources, (source, id) => {
    memory.sources[id] = {
      id,
      creepsCount: 0,
    };
  });

  if (config.VERBOSE) {
    console.log(`${sourceCount} sources in room.`);
  }
}

function getActiveSources() {
  return sources;
}

function getFirstSource() {
  return sources[0];
}

export const SourceManager = {
  loadSources,
  getActiveSources,
  getFirstSource,
};

