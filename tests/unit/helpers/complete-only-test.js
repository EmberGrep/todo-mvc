import { completeOnly } from '../../../helpers/complete-only';
import { module, test } from 'qunit';

module('Unit | Helper | complete only');

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
