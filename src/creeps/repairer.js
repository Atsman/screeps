import { CreepAction } from './creep.action';
import { RoomManager } from '../rooms';
import {
  STRUCTURE_WALL, STRUCTURE_RAMPART, FIND_STRUCTURES,
  FIND_CONSTRUCTION_SITES, ERR_NOT_IN_RANGE,
} from '../screeps.globals';

const SECURITY_STRUCTURES = [STRUCTURE_WALL, STRUCTURE_RAMPART];

function isSecurityStructure(structureType) {
  return _.includes(SECURITY_STRUCTURES, structureType);
}

function findClosestStrWhichNeedRepair(pos) {
  return pos.findClosestByPath(FIND_STRUCTURES, {
    filter: (obj) => {
      if (isSecurityStructure(obj.structureType)) {
        return obj.hits < 30000;
      }
      return obj.hits < obj.hitsMax - 100;
    },
  });
}

export class Repairer extends CreepAction {
  constructor(creep) {
    super(creep);
    const spawn = Game.getObjectById(this.creep.memory.renew_station_id);
    if (!spawn) {
      return;
    }
    this.targetSpawn = spawn;
    this.targetStructure = findClosestStrWhichNeedRepair(creep.pos);
  }

  isBagFull() {
    return this.creep.carry.energy === this.creep.carryCapacity;
  }

  isBagEmpty() {
    return this.creep.carry.energy === 0;
  }

  tryHarvest() {
    return this.targetSpawn.transferEnergy(this.creep);
  }

  moveToHarvest() {
    this.creep.say('moveToHarvest');
    if (this.tryHarvest() === ERR_NOT_IN_RANGE) {
      this.moveTo(this.targetSpawn);
    }
  }

  tryRepair() {
    return this.creep.repair(this.targetStructure);
  }

  moveToStructure() {
    this.creep.say('moveToStructure');
    if (this.tryRepair() === ERR_NOT_IN_RANGE) {
      this.moveTo(this.targetStructure);
    }
  }

  action() {
    if (this.needsRenew()) {
      this.moveToRenew();
    }
    if (this.creep.memory.building && this.isBagEmpty()) {
      this.creep.memory.building = false;
    }

    if (!this.creep.memory.building && this.isBagFull()) {
      this.creep.memory.building = true;
    }

    if (this.creep.memory.building) {
      this.moveToStructure();
    } else {
      this.moveToHarvest();
    }
  }
}
