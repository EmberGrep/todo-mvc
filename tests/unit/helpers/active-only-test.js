import { activeOnly } from '../../../helpers/active-only';
import { module, test } from 'qunit';

module('Unit | Helper | active only');

// Replace this with your real tests.
test('it returns a good default for non-arrays', function(assert) {
  let obj = {foo: 'bar'};

  let resultObj = activeOnly([obj]);
  assert.deepEqual(resultObj, []);

  let n = {foo: 'bar'};

  let resultNull = activeOnly([n]);
  assert.deepEqual(resultNull, []);

  let u = undefined;

  let resultUndefined = activeOnly([u]);
  assert.deepEqual(resultUndefined, []);

  let str = `I'm a teapot`;

  let resultStr = activeOnly([str]);
  assert.deepEqual(resultStr, []);
});
