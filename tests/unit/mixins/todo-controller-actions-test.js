import Ember from 'ember';
import TodoControllerActionsMixin from '../../../mixins/todo-controller-actions';
import { module, test } from 'qunit';

module('Unit | Mixin | todo controller actions');

// Replace this with your real tests.
test('it works', function(assert) {
  let TodoControllerActionsObject = Ember.Object.extend(TodoControllerActionsMixin);
  let subject = TodoControllerActionsObject.create();
  assert.ok(subject);
});
