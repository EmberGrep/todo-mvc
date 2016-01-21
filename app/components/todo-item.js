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
      set(this, 'editing', false);

      if (title === todo.title) {
        return;
      }

      const nextState = {
        ...todo,
        title
      };

      this.sendAction('onupdate', nextState);
    },

    startEdit() {
      set(this, 'editing', true);

      window.requestAnimationFrame(() => this.$('.edit').focus());
    },

    acceptKeyInput(todo, ev) {
      if (ev.keyCode === 27) {
        this.$('.edit').val(todo.title);

        set(this, 'editing', false);
      }

      if (ev.keyCode === 13) {
        this.send('updateTitle', todo);
      }
    }
  }
});
