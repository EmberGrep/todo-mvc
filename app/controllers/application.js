import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    createTodo(title, ev) {
      ev.preventDefault();
      console.log(title);
    }
  }
});
