import test from 'tape';
import lodash from 'lodash';
import { calculateHarvestersPerSource } from '../../src/creeps/creep.manager';


GLOBAL._ = lodash;

test('creep.manager', (t) => {
  t.test('calculateHarvestersPerSource', (t) => {
    const hs = [
      { memory: { target_source_id: 1 } },
      { memory: { target_source_id: 1 } },
      { memory: { target_source_id: 2 } },
      { memory: { target_source_id: 2 } },
      { memory: { target_source_id: 2 } },
    ];
    const sc = calculateHarvestersPerSource(hs);

    t.equal(sc[1], 2);
    t.equal(sc[2], 3);

    t.end();
  });
});
