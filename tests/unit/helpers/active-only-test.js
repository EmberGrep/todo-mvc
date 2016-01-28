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

test('it returns an array of active todos', function(assert) {
  let todos = [
    {title: 'Cereal', isComplete: false},
    {title: 'Milk', isComplete: false},
  ];

  let resultObj = activeOnly([todos]);
  assert.deepEqual(resultObj, todos);
});

test('it returns no tasks if all are done', function(assert) {
  let todos = [
    {title: 'Cereal', isComplete: true},
    {title: 'Milk', isComplete: true},
  ];

  let resultObj = activeOnly([todos]);
  assert.deepEqual(resultObj, []);
});

test('it returns only incomplete tasks from a mixed set', function(assert) {
  let todos = [
    {title: 'Cereal', isComplete: true},
    {title: 'Milk', isComplete: false},
  ];

  let resultObj = activeOnly([todos]);
  assert.deepEqual(resultObj, [{title: 'Milk', isComplete: false}]);
});

test('it returns empty when there are no todos', function(assert) {
  let todos = [];

  let resultObj = activeOnly([todos]);
  assert.deepEqual(resultObj, []);
});
