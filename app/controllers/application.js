import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    createTodo(title, ev) {
      ev.preventDefault();
      window.fetch('http://todo-mvc-api.herokuapp.com/api/todos', {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({todo: {title}})
      })
        .then((response) => response.json())
        .then((data) => console.log('request succeeded with JSON response', data));
    }
  }
});
