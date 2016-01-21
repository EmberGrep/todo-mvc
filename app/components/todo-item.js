import Ember from 'ember';
let {set} = Ember;

export default Ember.Component.extend({
  editing: false,

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
    },

    startEdit() {
      set(this, 'editing', true);

      window.requestAnimationFrame(() => this.$('.edit').focus());
    }
  }
});
