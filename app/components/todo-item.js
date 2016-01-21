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

    updateTitle(todo) {
      const title = this.$('.edit').val();

      const nextState = {
        ...todo,
        title
      };

      this.sendAction('onupdate', nextState);

      set(this, 'editing', false);
    },

    startEdit() {
      set(this, 'editing', true);

      window.requestAnimationFrame(() => this.$('.edit').focus());
    }
  }
});
