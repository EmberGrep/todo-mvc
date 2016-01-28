import { completeOnly } from '../../../helpers/complete-only';
import { module, test } from 'qunit';

module('Unit | Helper | complete only');

// Replace this with your real tests.
test('it returns a good default for non-arrays', function(assert) {
  let obj = {foo: 'bar'};

  let resultObj = completeOnly([obj]);
  assert.deepEqual(resultObj, []);

  let n = {foo: 'bar'};

  let resultNull = completeOnly([n]);
  assert.deepEqual(resultNull, []);

  let u = undefined;

  let resultUndefined = completeOnly([u]);
  assert.deepEqual(resultUndefined, []);

  let str = `I'm a teapot`;

  let resultStr = completeOnly([str]);
  assert.deepEqual(resultStr, []);
});

test('it returns an array of complete todos', function(assert) {
  let todos = [
    {title: 'Cereal', isComplete: true},
    {title: 'Milk', isComplete: true},
  ];

  let resultObj = completeOnly([todos]);
  assert.deepEqual(resultObj, todos);
});

test('it returns no tasks if no are done', function(assert) {
  let todos = [
    {title: 'Cereal', isComplete: false},
    {title: 'Milk', isComplete: false},
  ];

  let resultObj = completeOnly([todos]);
  assert.deepEqual(resultObj, []);
});

test('it returns only incompletee tasks from a mixed set', function(assert) {
  let todos = [
    {title: 'Cereal', isComplete: true},
    {title: 'Milk', isComplete: false},
  ];

  let resultObj = completeOnly([todos]);
  assert.deepEqual(resultObj, [{title: 'Cereal', isComplete: true}]);
});

test('it returns empty when there are no todos', function(assert) {
  let todos = [];

  let resultObj = completeOnly([todos]);
  assert.deepEqual(resultObj, []);
});
