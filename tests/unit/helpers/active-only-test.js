import { activeOnly } from '../../../helpers/active-only';
import { module, test } from 'qunit';

module('Unit | Helper | active only');

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
