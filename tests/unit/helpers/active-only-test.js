import { filter } from '../../../helpers/active-only';
import { module, test } from 'qunit';

module('Unit | Helper | active only');

test('it returns true for incomplete todos', function(assert) {
  let todo = { title: 'Cereal', isComplete: false };

  let result = filter(todo);
  assert.ok(result);
});

test('it returns false for complete todos', function(assert) {
  let todo = { title: 'Cereal', isComplete: true };

  let result = filter(todo);
  assert.notOk(result);
});
