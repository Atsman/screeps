import config from '../config';
import { RoomManager } from '../rooms/room.manager';

let sources;
let sourceCount;

function loadSources() {
  sources = RoomManager.getFirstRoom().find(FIND_SOURCES_ACTIVE);
  sourceCount = _.size(sources);

  if (config.VERBOSE) {
    console.log(`${sourceCount} sources in room.`);
  }
}

function getFirstSource() {
  return sources[0];
}

export const SourceManager = {
  loadSources,
  getFirstSource,
};

