import Ember from 'ember';

export function completOnly([todos]/*, hash*/) {
  return todos.filter((todo) => {
    return !!todo.isComplete;
  });
}

export default Ember.Helper.helper(completOnly);
