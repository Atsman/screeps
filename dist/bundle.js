/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmory imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmory exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		Object.defineProperty(exports, name, {
/******/ 			configurable: false,
/******/ 			enumerable: true,
/******/ 			get: getter
/******/ 		});
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 10);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
const VERBOSE = true;

const MAX_HARVESTERS_PER_SOURCE = 4;

const USE_PATHFINDER = true;

const DEFAULT_MIN_LIFE_BEFORE_NEEDS_REFILL = 700;

/* harmony default export */ exports["default"] = {
  VERBOSE,
  MAX_HARVESTERS_PER_SOURCE,
  USE_PATHFINDER,
  DEFAULT_MIN_LIFE_BEFORE_NEEDS_REFILL,
};


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
const config = __webpack_require__(0);

let rooms;
let roomNames = [];

function loadRooms() {
  rooms = Game.rooms;
  roomNames = _.keys(Game.rooms);

  if (config.VERBOSE) {
    console.log(`${roomNames.length} rooms found.`);
  }
}

function getFirstRoom() {
  return rooms[roomNames[0]];
}

const RoomManager = {
  loadRooms,
  getFirstRoom,
};
/* harmony export (immutable) */ exports["RoomManager"] = RoomManager;



/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__config__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__rooms_room_manager__ = __webpack_require__(1);



let sources;
let sourceCount;

function loadSources() {
  sources = __WEBPACK_IMPORTED_MODULE_1__rooms_room_manager__["RoomManager"].getFirstRoom().find(FIND_SOURCES_ACTIVE);
  sourceCount = _.size(sources);

  if (__WEBPACK_IMPORTED_MODULE_0__config__["default"].VERBOSE) {
    console.log(`${sourceCount} sources in room.`);
  }
}

function getFirstSource() {
  return sources[0];
}

const SourceManager = {
  loadSources,
  getFirstSource,
};
/* harmony export (immutable) */ exports["SourceManager"] = SourceManager;




/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__config__ = __webpack_require__(0);


let spawns;
let spawnCount;
let spawnNames = [];

function loadSpawns() {
  spawns = Game.spawns;
  spawnCount = _.size(spawns);
  spawnNames = _.keys(spawns);

  if (__WEBPACK_IMPORTED_MODULE_0__config__["default"].VERBOSE) {
    console.log(`${spawnCount} spawns in room.`);
  }
}

function getFirstSpawn() {
  return spawns[spawnNames[0]];
}

const SpawnManager = {
  loadSpawns,
  getFirstSpawn,
};
/* harmony export (immutable) */ exports["SpawnManager"] = SpawnManager;




/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__config__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__constants__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__sources_source_manager__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__harvester__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__spawns_spawn_manager__ = __webpack_require__(3);






let creeps;
let creepNames;
let creepCount;

function loadCreeps() {
  creeps = Game.creeps;
  creepNames = _.keys(Game.creeps);
  creepCount = creepNames.length;

  if (__WEBPACK_IMPORTED_MODULE_0__config__["default"].VERBOSE) {
    console.log(`${creepCount} creeps found.`);
  }
}

function createHarvester() {
  const bodyParts = [MOVE, MOVE, CARRY, WORK];
  const name = undefined;
  const props = {
    renew_station_id: __WEBPACK_IMPORTED_MODULE_4__spawns_spawn_manager__["SpawnManager"].getFirstSpawn().id,
    role: __WEBPACK_IMPORTED_MODULE_1__constants__["a" /* ROLES */].HARVESTER,
    target_energy_dropoff_id: __WEBPACK_IMPORTED_MODULE_4__spawns_spawn_manager__["SpawnManager"].getFirstSpawn().id,
    target_source_id: __WEBPACK_IMPORTED_MODULE_2__sources_source_manager__["SourceManager"].getFirstSource().id,
  };

  let status = __WEBPACK_IMPORTED_MODULE_4__spawns_spawn_manager__["SpawnManager"].getFirstSpawn().canCreateCreep(bodyParts, name);
  if (status === OK) {
    status = __WEBPACK_IMPORTED_MODULE_4__spawns_spawn_manager__["SpawnManager"].getFirstSpawn().createCreep(bodyParts, name, props);
    if (__WEBPACK_IMPORTED_MODULE_0__config__["default"].VERBOSE) {
      console.log('started creating new HARVESTER');
    }
  }
  return status;
}

function harvestersGoToWork() {
  let harvestersCount = 0;
  _.forEach(creeps, (creep) => {
    if (creep.memory.role === __WEBPACK_IMPORTED_MODULE_1__constants__["a" /* ROLES */].HARVESTER) {
      const harvester = new __WEBPACK_IMPORTED_MODULE_3__harvester__["a" /* Harvester */]();
      harvester.setCreep(creep);
      harvester.action();
      harvestersCount += 1;
    }
  });

  if (__WEBPACK_IMPORTED_MODULE_0__config__["default"].VERBOSE) {
    console.log(harvestersCount + ' harvesters reported.');
  }
}

function isHarvesterLimitFull() {
  return __WEBPACK_IMPORTED_MODULE_0__config__["default"].MAX_HARVESTERS_PER_SOURCE === creepCount;
}


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__memory_manager__ = __webpack_require__(9);
/* unused harmony reexport MemoryManager */



/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
const ROLES = {
  HARVESTER: 'harvester',
  UPGRADER: 'upgrader',
  BUILDER: 'builder',
  REPAIRER: 'repairer',
};
/* harmony export (immutable) */ exports["a"] = ROLES;



/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__config__ = __webpack_require__(0);


class CreepAction {
  constructor(creep) {
    this.creep = creep;
    const spawn = Game.getObjectById(this.creep.memory.renew_station_id);
    if (!spawn) {
      return;
    }
    this.renewStation = spawn;
    this.minLifeBeforeNeedsRenew = __WEBPACK_IMPORTED_MODULE_0__config__["default"].DEFAULT_MIN_LIFE_BEFORE_NEEDS_REFILL;
  }

  moveTo(target) {
    this.creep.moveTo(target);
  }

  needRenew() {
    return this.creep.ticksToLive < this.minLifeBeforeNeedsRenew;
  }

  tryRenew() {
    return this.renewStation.renewCreep(this.creep);
  }

  moveToRenew() {
    if (this.tryRenew() === ERR_NOT_IN_RANGE) {
      this.moveTo(this.renewStation);
    }
  }

  static action() {
    return true;
  }
}
/* harmony export (immutable) */ exports["CreepAction"] = CreepAction;



/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
const { CreepAction } = __webpack_require__(7);

class Harvester extends CreepAction {
  constructor(creep) {
    super(creep);
    const source = Game.getObjectById(this.creep.memory.target_source_id);
    const dropOff = Game.getObjectById(this.creep.memory.target_energy_dropoff_id);

    if (!source || !dropOff) {
      return false;
    }

    this.targetSource = source;
    this.targetEnergyDropOff = dropOff;
  }

  isBagFull() {
    return this.creep.carry.energy === this.creep.carryCapacity;
  }

  tryHarvest() {
    return this.creep.harvest(this.targetSource);
  }

  moveToHarvest() {
    if (this.tryHarvest() === ERR_NOT_IN_RANGE) {
      this.moveTo(this.targetSource);
    }
  }

  tryEnergyDropOff() {
    return this.creep.transfer(this.targetEnergyDropOff, RESOURCE_ENERGY);
  }

  moveToDropEnergy() {
    if (this.tryEnergyDropOff() === ERR_NOT_IN_RANGE) {
      this.moveTo(this.targetEnergyDropOff);
    }
  }

  action() {
    if (this.needsRenew()) {
      this.moveToRenew();
    } else if (this.isBagFull()) {
      this.moveToDropEnergy();
    } else {
      this.moveToHarvest();
    }
    return true;
  }
}
/* harmony export (immutable) */ exports["a"] = Harvester;



/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
let memory;

function loadMemory() {
  memory = Memory;
}

function getMemory() {
  return memory;
}

const MemoryManager = {
  loadMemory,
  getMemory,
};
/* unused harmony export MemoryManager */



/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__config__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__shared__ = __webpack_require__(5);



const RoomManager = __webpack_require__(1);
const SpawnManager = __webpack_require__(3);
const SourceManager = __webpack_require__(2);
const CreepManager = __webpack_require__(4);

RoomManager.loadRooms();
SpawnManager.loadSpawns();
SourceManager.loadSources();

if (__WEBPACK_IMPORTED_MODULE_0__config__["default"].USE_PATHFINDER) {
  PathFinder.use(true);
}

module.exports.loop = () => {
  __WEBPACK_IMPORTED_MODULE_1__shared__["default"].loadMemory();
  CreepManager.loadCreeps();

  if (!CreepManager.isHarvesterLimitFull()) {
    CreepManager.createHarvester();
  }

  CreepManager.harvestersGoToWork();
};


/***/ }
/******/ ]);