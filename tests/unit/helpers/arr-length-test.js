import { arrLength } from '../../../helpers/arr-length';
import { module, test } from 'qunit';

module('Unit | Helper | arr length');

// Replace this with your real tests.
test('it calculates the length of an array', function(assert) {
  let arr = [42, 12, 15];

  let result = arrLength([arr]);
  assert.equal(result, 3);
});

test('it returns a good default for non-arrays', function(assert) {
  let obj = {foo: 'bar'};

  let resultObj = arrLength([obj]);
  assert.equal(resultObj, 0);

  let n = {foo: 'bar'};

  let resultNull = arrLength([n]);
  assert.equal(resultNull, 0);

  let u = undefined;

  let resultUndefined = arrLength([u]);
  assert.equal(resultUndefined, 0);

  let str = `I'm a teapot`;

  let resultStr = arrLength([str]);
  assert.equal(resultStr, 0);
});
