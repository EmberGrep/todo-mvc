import arrFilter from '../../../utils/arr-filter';
import { module, test } from 'qunit';

module('Unit | Utility | arr filter');

test('it returns a composed function', function(assert) {
  let composed = arrFilter();

  assert.equal(typeof composed, 'function');
});

test('it returns a good default for non-arrays', function(assert) {
  let composed = arrFilter();
  let obj = {foo: 'bar'};

  let resultObj = composed([obj]);
  assert.deepEqual(resultObj, []);

  let n = {foo: 'bar'};

  let resultNull = composed([n]);
  assert.deepEqual(resultNull, []);

  let u = undefined;

  let resultUndefined = composed([u]);
  assert.deepEqual(resultUndefined, []);

  let str = `I'm a teapot`;

  let resultStr = composed([str]);
  assert.deepEqual(resultStr, []);
});
