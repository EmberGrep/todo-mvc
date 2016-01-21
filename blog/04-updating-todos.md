# Ember CLI TodoMVC - Updating Todos

Now to match the functionality of TodoMVC, we need our app to allow users to double click on todos, edit the title, and have these changes saved to the server.

## Creating a Todo Item Component

In Ember when we want to create reusable parts of our application, we can create components.
Let's create a new one called `todo-item` from the command line:

```
ember g component todo-item
```

Now we have two new files:

* `app/components/todo-item.js`
* `app/templates/components/todo-item.hbs`

To start let's make a single `todo-item` component represent a single list item for an item in our todo list.
We can do this by copying the template code from our `li` into the template for our new component:

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

Now we need to go to our `application` template and instead of having to write out the full list item with all of it's contents, we can now just drop in our new `todo-item` component and pass in the `todo` from our list:

```hbs
{{#each model as |todo|}}
  {{todo-item todo=todo}}
{{/each}}
```

Now we are seeing a familiar error in our console:

```
Uncaught Error: An action named 'toggleDone' was not found in <todo-mvc@component:todo-item::ember383>
```

Since our actions are now bound to our component instead of our controller.
So we will have to do a bit of work to fix this.
In the `app/components/todo-item.js`, let's create an `actions` object with functions for `deleteTodo` and `toggleDone` to get rid of these errors:

```js
import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    deleteTodo(todo) {

    },

    toggleDone(todo) {

    }
  }
});
```

While our errors are gone, our app is no longer deleting items or saving toggled changes to the server.

## Action Responsibilities

Now that we have a component, we can do a bit more work within our component and let our controller worry less about data manipulation of individual todos.
So to start, let's work on our `toggleDone` function in our component.

Best practice states that components should prepare data, but directly save or alter it's state.
Instead actions are pushed up and parent components and controllers which have further context and knowledge of the outside world can decide what to do.
This is often called "Actions Up".

In regards to our `todo-item` component, the component might know how to figure out what the state that needs to be saved to the server SHOULD be.
But, it should not know how to ACTUALLY save this item to the server.
Instead that logic will remain in our controller.
So, let's prepare the `nextState` for our todo in `toggleDone` in our component by copying code from our original implementation:

```js
import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    deleteTodo(todo) {

    },

    toggleDone(todo) {
      const nextState = {
        ...todo,
        isComplete: !todo.isComplete
      };
    }
  }
});
```

Now we need a way to send this information up so that our controller can decide what to do with this information.
In components, we have the `sendAction` method which allows us to pass data back up through our templates.
Here we'll send a `onupdate` action and as a second argument, we'll send the `nextState`.

```js
import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    deleteTodo(todo) {

    },

    toggleDone(todo) {
      const nextState = {
        ...todo,
        isComplete: !todo.isComplete
      };

      this.sendAction('onupdate', nextState);
    }
  }
});
```

If we click on the checkbox, we'll notice that our network request still isn't going through.
This is because when a component uses `sendAction`, we have to opt in to listening for this action to fire and bind it to an action in the parent template.
So we'll update our `application` template to bind the `onupdate` attribute to a `saveTodo` action.

```hbs
{{#each model as |todo|}}
  {{todo-item todo=todo onupdate=(action 'saveTodo')}}
{{/each}}
```

> **NOTE** Since we are already in handlebars syntax when creating the `todo-item` component we have to use parenthesis to bind `onupdate` to our action.

Then we can repurpose our old `toggleDone` in our `application` controller to only be responsible for saving our record and updating the `model` for our controller.

```js
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
}
```

And there we go!
Our network requests are going through and if we refresh the page, we'll see that our records have been saved.
Let's make sure our deletes are working.
In the component, we don't need to do any work, so let's just use sendAction to alert `ondestroy`:

```js
deleteTodo(todo) {
  this.sendAction('ondestroy', todo);
}
```

And in our `application` template, let's bind `ondestroy` to our existing `deleteTodo` action in our controller:

```hbs
{{#each model as |todo|}}
  {{todo-item todo=todo onupdate=(action 'saveTodo') ondestroy=(action 'deleteTodo')}}
{{/each}}
```

## Edit Mode Using Local Component State

Now we need to make it so that our todo item toggles an `editing` class on our `li` when we double click on the title.
To start let's add a `startEdit` action `ondblclick`:

```hbs
<li class="{{if todo.isComplete "completed"}}">
  <div class="view">
    <input class="toggle" type="checkbox" checked={{todo.isComplete}} onchange={{action "toggleDone" todo}}>
    <label ondblclick={{action "startEdit"}}>{{todo.title}}</label>
    <button class="destroy" onclick={{action "deleteTodo" todo}}></button>
  </div>
  <input class="edit" value="{{todo.title}}">
</li>
```

And we'll create our `startEdit` action in our component:

```js
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

  startEdit() {

  }
}
```

Now let's use `Ember.set` to change a property called `editing` to `true` on our current component.
While we're at it, let's set a starting value for `editing` to `false`:

```js
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

    startEdit() {
      set(this, 'editing', true);
    }
  }
});
```

And now we'll listen for this change in our template to toggle the `editing` class on our `li`:

```handlebars
<li class="{{if todo.isComplete "completed"}} {{if editing "editing"}}">
  <div class="view">
    <input class="toggle" type="checkbox" checked={{todo.isComplete}} onchange={{action "toggleDone" todo}}>
    <label ondblclick={{action "startEdit"}}>{{todo.title}}</label>
    <button class="destroy" onclick={{action "deleteTodo" todo}}></button>
  </div>
  <input class="edit" value="{{todo.title}}">
</li>
```

Note that we are using `editing` not `todo.editing` because we want to know the local state of the component NOT the state of the todo it represents.

One last thing before we move on to saving title changes, let's make sure that we focus the input.
In Ember Components, there is a `$` property which is a jQuery find method scoped for the element that represents our component (more on this element in a bit).
So we can find the `edit` input within our current component after toggling `editing`:

```js
startEdit() {
  set(this, 'editing', true);
  this.$('.edit').focus();
}
```

Unfortunately since the input is hidden until after Ember re-renders, we will not be able to set focus quite yet.
We can get around this and tell the browser to focus on the next frame by using `window.requestAnimationFrame`:

```js
startEdit() {
  set(this, 'editing', true);

  window.requestAnimationFrame(() => this.$('.edit').focus());
}
```

## Saving Title changes

Now we can listen for our `edit` input's `onchange` which will fire when our user unfocuses from the input or hits "Enter".
Then we can fire a `updateTitle` action and send our existing todo.

```handlebars
<li class="{{if todo.isComplete "completed"}} {{if editing "editing"}}">
  <div class="view">
    <input class="toggle" type="checkbox" checked={{todo.isComplete}} onchange={{action "toggleDone" todo}}>
    <label ondblclick={{action "startEdit"}}>{{todo.title}}</label>
    <button class="destroy" onclick={{action "deleteTodo" todo}}></button>
  </div>
  <input class="edit" value="{{todo.title}}" onchange={{action "updateTitle" todo}}>
</li>
```

When we receive the `updateTitle` action, we need to figure out the next state for our todo and toggle out of `editing` mode.
We can grab the value of our input and set the title similar to what we used for `toggleDone`:

```js
updateTitle(todo) {
  const title = this.$('.edit').val();

  const nextState = {
    ...todo,
    title
  };
},
```

Now since our controller is able to respond to `onupdate`, it actually doesn't matter if that update is a change in title or a change in `isComplete`:

```js
updateTitle(todo) {
  const title = this.$('.edit').val();

  const nextState = {
    ...todo,
    title
  };

  this.sendAction('onupdate', nextState);
},
```

The last thing we should do is set `editing` to false.

```js
updateTitle(todo) {
  const title = this.$('.edit').val();

  const nextState = {
    ...todo,
    title
  };

  this.sendAction('onupdate', nextState);

  set(this, 'editing', false);
}
```

## Canceling Title Changes

Now our user should also be able to cancel changing the title by pressing "ESC".
So we'll add an action for `cancelEditing` when `onkeyup` fires and we'll send the existing todo so we can reset the input value:

```hbs
<input class="edit" value="{{todo.title}}" onchange={{action "updateTitle" todo}} onkeyup={{action "cancelEditing" todo}}>
```

And now we can handle the `cancelEditing` action, if the "ESC" key (key code 27) was pressed, we will reset the input value and set `editing` to false

```js
cancelEditing(todo, ev) {
  if (ev.keyCode === 27) {
    this.$('.edit').val(todo.title);

    set(this, 'editing', false);
  }
}
```

So now we have the basic edit functionality and we can cancel.

## Edgecase

There is one edgecase in our app right now.
If we unfocus or hit "Enter" without changing our app doesn't leave editing mode.
So we can listen for `onblur` instead of `onchange` so that `updateTitle` is only run when we leave focus.

```hbs
<input class="edit" value="{{todo.title}}" onblur={{action "updateTitle" todo}} onkeyup={{action "cancelEditing" todo}}>
```

Then we should rename our `cancelEditing` to something more appropriate: `acceptKeyInput`:

```hbs
<input class="edit" value="{{todo.title}}" onblur={{action "updateTitle" todo}} onkeyup={{action "cancelEditing" todo}}>
```

And we'll need to update our JavaScript:

```js
acceptKeyInput(todo, ev) {
  if (ev.keyCode === 27) {
    this.$('.edit').val(todo.title);

    set(this, 'editing', false);
  }
}
```

Then we can listen for the keyCode `13` and run our `updateTitle` action by using `this.send` which will fire an action locally to the current component:

```js
acceptKeyInput(todo, ev) {
  if (ev.keyCode === 27) {
    this.$('.edit').val(todo.title);

    set(this, 'editing', false);
  }

  if (ev.keyCode === 13) {
    this.send('updateTitle', todo);
  }
}
```

Now we've covered our edgecases, but we are saving when we don't need to.
Check to see that the `title` actually has changed before propagating the change:

```js
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
}
```

> **NOTE** we moved the setting for `editing` to the top to make sure we still leave editing mode

In this post, we've broken our todo items into a component to better work with editing and toggling todo state.
In the next post, we'll look at routing so that the user can change between all, active, and completed tasks.
