import { ROLES } from '../constants';

const { HARVESTER, BUILDER, UPGRADER, REPAIRER } = ROLES;

function groupCreepsByRole() {
  return _.groupBy(Game.creeps, creep => creep.memory.role);
}

export const creepStore = {
  initialize() {
    this.creepNames = _.keys(Game.creeps);
    this.creepCount = this.creepNames.length;
    this.groopedCreeps = groupCreepsByRole();
  },

  getCreepCount() {
    return this.creepCount;
  },

  getCreepNames() {
    return this.creepNames;
  },

  getHarvesters() {
    return this.groopedCreeps[ROLES.HARVESTER] || [];
  },

  getUpgraders() {
    return this.groopedCreeps[ROLES.UPGRADER] || [];
  },

  getRepairers() {
    return this.groopedCreeps[ROLES.REPAIRER] || [];
  },

  getBuilders() {
    return this.groopedCreeps[ROLES.BUILDER] || [];
  },
};
