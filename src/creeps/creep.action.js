import config from '../config';

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
