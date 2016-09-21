import { CreepAction } from './creep.action';
import {
  RESOURCE_ENERGY, STRUCTURE_EXTENSION, STRUCTURE_TOWER,
  FIND_STRUCTURES,
} from '../screeps.globals';

const CHARGING_STRUCTURES = [STRUCTURE_EXTENSION, STRUCTURE_TOWER];

function isChargingStructure(structureType) {
  return _.includes(CHARGING_STRUCTURES, structureType);
}

function findWornStructures(pos) {
  return pos.findClosestByPath(FIND_STRUCTURES, {
    filter: structure => isChargingStructure(structure.structureType)
      && structure.energy < structure.energyCapacity,
  });
}

function isSpawnFull(spawn) {
  return spawn.energy === spawn.energyCapacity;
}

export class Harvester extends CreepAction {
  constructor(creep) {
    super(creep);
    const source = Game.getObjectById(this.creep.memory.target_source_id);
    const dropOff = Game.getObjectById(this.creep.memory.target_energy_dropoff_id);

    if (!source || !dropOff) {
      return;
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
    let targetEnergyDropOff;
    if (isSpawnFull(this.targetEnergyDropOff)) {
      targetEnergyDropOff = findWornStructures(this.creep.pos);
    } else {
      targetEnergyDropOff = this.targetEnergyDropOff;
    }
    if (this.tryEnergyDropOff() === ERR_NOT_IN_RANGE) {
      this.moveTo(targetEnergyDropOff);
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
