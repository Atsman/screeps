import config from '../config';
import { ERR_NOT_IN_RANGE } from '../screeps.globals';

export class CreepAction {
  constructor(creep) {
    this.creep = creep;
    const spawn = Game.getObjectById(this.creep.memory.renew_station_id);
    if (!spawn) {
      return;
    }
    this.renewStation = spawn;
    this.minLifeBeforeNeedsRenew = config.DEFAULT_MIN_LIFE_BEFORE_NEEDS_REFILL;
  }

  moveTo(target) {
    this.creep.moveTo(target);
  }

  needsRenew() {
    return this.creep.ticksToLive < this.minLifeBeforeNeedsRenew;
  }

  tryRenew() {
    return this.renewStation.renewCreep(this.creep);
  }

  moveToRenew() {
    this.creep.say('moveToRenew');
    if (this.tryRenew() === ERR_NOT_IN_RANGE) {
      this.moveTo(this.renewStation);
    }
  }

  static action() {
    return true;
  }
}
