import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    deleteTodo(todo) {
      this.sendAction('ondestroy', todo);
    },

    toggleDone(todo) {
      const nextState = {
        ...todo,
        isComplete: !todo.isComplete
      };

      this.sendAction('onupdate', nextState);
    }
  }
});
