import Ember from 'ember';
const {set} = Ember;

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
        .then((data) => {
          set(this, 'newTitle', '');
          console.log('request succeeded with JSON response', data);
        });
    }
  }
});
