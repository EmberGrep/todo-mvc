import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return {
      todos: this.modelFor('application'),
      filter: 'active'
    };
  }
});
