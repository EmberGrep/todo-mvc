import { filter } from '../../../helpers/complete-only';
import { module, test } from 'qunit';

module('Unit | Helper | complete only');

test('it returns true for complete todos', function(assert) {
  let todo = { title: 'Cereal', isComplete: true };

  let result = filter(todo);
  assert.ok(result);
});

test('it returns false for incomplete todos', function(assert) {
  let todo = { title: 'Cereal', isComplete: false };

  let result = filter(todo);
  assert.notOk(result);
});
