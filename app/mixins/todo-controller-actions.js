import Ember from 'ember';

export default Ember.Mixin.create({
  appController: Ember.inject.controller('application'),

  actions: {
    createTodo() {
      this.get('appController').send('createTodo', ...arguments);
    },

    deleteTodo() {
      this.get('appController').send('deleteTodo', ...arguments);
    },

    saveTodo() {
      this.get('appController').send('saveTodo', ...arguments);
    },
  },
});
