import { CreepAction } from './creep.action';
import { RoomManager } from '../rooms';
import { ERR_NOT_IN_RANGE } from '../screeps.globals';

export class Upgrader extends CreepAction {
  constructor(creep) {
    super(creep);
    const spawn = Game.getObjectById(this.creep.memory.renew_station_id);
    if (!spawn) {
      return;
    }
    this.targetSpawn = spawn;
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
    if (this.tryHarvest() === ERR_NOT_IN_RANGE) {
      this.moveTo(this.targetSource);
    }
  }

  tryUpgrade() {
    return this.creep.upgradeController(this.creep.room.controller);
  }

  moveToController() {
    if (this.tryUpgrade() === ERR_NOT_IN_RANGE) {
      this.moveTo(this.creep.room.controller);
    }
  }

  action() {
    if (this.creep.memory.upgrading && this.isBagEmpty()) {
      this.creep.memory.upgrading = false;
    }

    if (!this.creep.memory.upgrading && this.isBagFull()) {
      this.creep.memory.upgrading = true;
    }

    if (this.creep.memory.upgrading) {
      this.moveToController();
    } else {
      this.moveToHarvest();
    }
  }
}
