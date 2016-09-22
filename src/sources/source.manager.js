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
  if (!memory.sources) {
    memory.sources = {};

    _.forEach(sources, (source) => {
      memory.sources[source.id] = {
        id: source.id,
        creepsCount: 0,
      };
    });
  }

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
  init: loadSources,
  getActiveSources,
  getFirstSource,
};

