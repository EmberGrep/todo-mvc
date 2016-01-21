# Ember CLI TodoMVC - Deleting and Toggling Todos

Now that we are able to create and pull in our Todos, we need to allow our users to delete and toggle the `isComplete` status our existing todos.

## Deleting Todos

First, let's allow our user to delete todos from our list since our HTML is already set up for it.
Let's add an `onclick` action to the `destroy` button and call a `deleteTodo` action while passing the todo (we'll need this to know which todo we are wanting to delete):

```hbs
<li class="completed">
  <div class="view">
    <input class="toggle" type="checkbox" checked>
    <label>{{todo.title}}</label>
    <button class="destroy" onclick={{action "deleteTodo" todo}}></button>
  </div>
  <input class="edit" value="{{todo.title}}">
</li>
```

Now we need to add the `deleteTodo` to our actions in our `app/controllers/application.js`:

```js
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
          const allTodos = [data.todo, ...this.model];

          set(this, 'model', allTodos);
        });
    },

    deleteTodo(todo) {

    }
  }
});
```

Alright, action is all set up, now we just need to ACTUALLY delete the todo on our server.
We'll use `fetch` again and make a `DELETE` request to our server:

```js
deleteTodo(todo) {
  fetch(`http://todo-mvc-api.herokuapp.com/api/todos/${todo.id}`, { method: 'delete' })
    .then((response) => response.ok ? window.Promise.resolve() : window.Promise.reject())
    .then(() => {
      console.log('request succeeded to delete');
    });
}
```

Here we check if the response was ok if so, we'll resolve the promise, if not, we reject it (although we won't be handling errors quite yet).

## Removing Deleted Todos

Now we need to make our todo list update to show what todos are still remaining.
Just like before we will reset the value of `model`.
However this time, we'll have to use filtering to take our record out of the original array:

```js
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
}
```

Ok, so now we've implemented deletes, but now we need a way to edit our todos.

## Marking Todos as Completed

Right now it looks like our todos are completed, but this isn't quite right.
We'll have to show the right status, but first let's try to toggle if a todo is complete.
Let's start by adding an `onchange` to the checkbox and run a `toggleDone` action:

```hbs
<input class="toggle" type="checkbox" checked onchange={{action "toggleDone" todo}}>
```

And we'll need to add the `toggleDone` method to our `actions` object:

```js
toggleDone(todo) {

}
```

Now we need to figure out the new state of our todo that we want to save to the server.
We'll once again rely on immutability, so we'll create a new object with the properties of our old `todo`.
After that, we can create a toggled version of our `isComplete` property:

```js
toggleDone(todo) {
  const updatedTodo = {
    ...todo,
    isComplete: !todo.isComplete
  };
}
```

Ok, so we have what our todo should look like when we save it to our server.
Let's make our `fetch` request:

```js
toggleDone(todo) {
  const updatedTodo = {
    ...todo,
    isComplete: !todo.isComplete
  };

  window.fetch(`http://todo-mvc-api.herokuapp.com/api/todos/${todo.id}`, {
    method: 'put',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({todo: updatedTodo})
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('request succeeded with JSON response', data);
    });
}
```

Now, we need to update our data.
Here, we'll use the `map` function on our model array to map through our todo records and replace the item that we've updated:

```js
toggleDone(todo) {
  const updatedTodo = {
    ...todo,
    isComplete: !todo.isComplete
  };

  window.fetch(`http://todo-mvc-api.herokuapp.com/api/todos/${todo.id}`, {
    method: 'put',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({todo: updatedTodo})
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('request succeeded with JSON response', data);
      const allTodos = this.model.map((currentTodo) => currentTodo.id === data.todo.id ? data.todo : currentTodo);
      set(this, 'model', allTodos);
    });
}
```

## Showing Todo Status

Now that we have our todos toggling the `isComplete` property, let's get this to show to the user.
In our template, we can use an inline `if` helper to toggle showing the `completed` class on our li.

```hbs
<li class="{{if todo.isComplete "completed"}}">
  <div class="view">
    <input class="toggle" type="checkbox" checked onchange={{action "toggleDone" todo}}>
    <label>{{todo.title}}</label>
    <button class="destroy" onclick={{action "deleteTodo" todo}}></button>
  </div>
  <input class="edit" value="{{todo.title}}">
</li>
```

Similarly, we can make the `value` of our `checkbox` set to `todo.isComplete`.
Note, that since we don't want to opt in to two way binding, we won't use the ember `input` component:

```hbs
<li class="{{if todo.isComplete "completed"}}">
  <div class="view">
    <input class="toggle" type="checkbox" checked={{todo.isComplete}} onchange={{action "toggleDone" todo}}>
    <label>{{todo.title}}</label>
    <button class="destroy" onclick={{action "deleteTodo" todo}}></button>
  </div>
  <input class="edit" value="{{todo.title}}">
</li>
```

In this post, we've allowed our users to delete and toggle the `isComplete` status for todos.
In the next post, we'll allow our users to double click to edit the title of an existing todo.

## PS. Improving Accessibility For Destroy

To add some extra UX and accessibility, we can make a small change to our CSS to make it a bit more clear that our `destroy` button is clickable.
Ember CLI ships with an `app/styles/app.css` file for our custom app styles.
Here let's change the cursor on the `destroy` button to be a `pointer`.
This will make it more clear that our button is clickable and will also help make sure we don't run into [touch event issues on mobile](https://github.com/emberjs/ember.js/issues/586):

```css
.destroy {
  cursor: pointer;
}
```
