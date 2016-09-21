const { CreepAction } = require('./creep.action');

export class Harvester extends CreepAction {
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
