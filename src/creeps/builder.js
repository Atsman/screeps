import { CreepAction } from './creep.action';
import { RoomManager } from '../rooms';
import { FIND_CONSTRUCTION_SITES } from '../screeps.globals';

export class Builder extends CreepAction {
  constructor(creep) {
    super(creep);
    const spawn = Game.getObjectById(this.creep.memory.renew_station_id);
    if (!spawn) {
      return;
    }
    this.targetSpawn = spawn;
    this.targetStructure = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
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
      this.moveTo(this.targetSource);
    }
  }

  tryBuild() {
    return this.creep.build(this.targetStructure);
  }

  moveToStructure() {
    this.creep.say('moveToStructure');
    if (this.tryBuild() === ERR_NOT_IN_RANGE) {
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
