import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return fetch('http://todo-mvc-api.herokuapp.com/api/todos')
      .then((response) => response.json())
      .then((data) => data.todos);
  }
});
