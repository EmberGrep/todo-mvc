import Ember from 'ember';
const {set} = Ember;

export default Ember.Controller.extend({
  actions: {
    createTodo(title, ev) {
      ev.preventDefault();
      window.fetch('http://todo-mvc-api.herokuapp.com/api/todos', {
        method: 'post',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({todo: {title}}),
      })
        .then((response) => response.json())
        .then((data) => {
          set(this, 'newTitle', '');
          console.log('request succeeded with JSON response', data);
          const allTodos = [data.todo, ...this.model];

          set(this, 'model', allTodos);
        });
    },

    deleteTodo(todo) {
      fetch(`http://todo-mvc-api.herokuapp.com/api/todos/${todo.id}`, { method: 'delete' })
        .then((response) => response.ok ? window.Promise.resolve() : window.Promise.reject())
        .then(() => {
          console.log('request succeeded to delete');
          const allTodos = this.model.filter((currentTodo) => {
            return todo.id !== currentTodo.id
          });

          set(this, 'model', allTodos);
        });
    },

    saveTodo(todo) {
      window.fetch(`http://todo-mvc-api.herokuapp.com/api/todos/${todo.id}`, {
        method: 'put',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({todo: todo})
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('request succeeded with JSON response', data);
          const allTodos = this.model.map((currentTodo) => currentTodo.id === data.todo.id ? data.todo : currentTodo);
          set(this, 'model', allTodos);
        });
    },

    deleteTodos(todos) {
      todos.forEach(todo => {
        this.send('deleteTodo', todo);
      });
    },
  },
});
