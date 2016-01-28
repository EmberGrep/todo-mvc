import Ember from 'ember';

export function activeOnly([todos]/*, hash*/) {
  if (typeof todos !== 'object' || typeof todos.filter !== 'function') {
    return [];
  }

  return todos.filter((todo) => {
    return !todo.isComplete;
  });
}

export default Ember.Helper.helper(activeOnly);
