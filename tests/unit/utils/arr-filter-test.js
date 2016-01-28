import arrFilter from '../../../utils/arr-filter';
import { module, test } from 'qunit';

module('Unit | Utility | arr filter');

const testFilter = item => item;

test('it returns a composed function', function(assert) {
  let composed = arrFilter(testFilter);

  assert.equal(typeof composed, 'function');
});

test('it returns a good default for non-arrays', function(assert) {
  let composed = arrFilter(testFilter);
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

test('it returns an array of true items', function(assert) {
  let composed = arrFilter(testFilter);
  let items = [true, true];

  let resultObj = composed([items]);
  assert.deepEqual(resultObj, items);
});

test('it returns no false items', function(assert) {
  let composed = arrFilter(testFilter);
  let items = [false, false];

  let resultObj = composed([items]);
  assert.deepEqual(resultObj, []);
});

test('it returns mixed items', function(assert) {
  let composed = arrFilter(testFilter);
  let items = [false, true];

  let resultObj = composed([items]);
  assert.deepEqual(resultObj, [true]);
});
