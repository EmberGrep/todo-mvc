import Ember from 'ember';

export function activeOnly([todos]/*, hash*/) {
  return todos.filter((todo) => {
    return !todo.isComplete;
  });
}

export default Ember.Helper.helper(activeOnly);
