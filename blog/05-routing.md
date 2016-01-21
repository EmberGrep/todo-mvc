# Ember CLI TodoMVC - Routing & Filtering Data

Now that we have our data populating, deleting, and editing it's time to work on the footer for our TodoMVC app.

## Listing Numbers of Incomplete Todos

The first thing that we need to do is list the number of todos in our list.
While we could just use `model.length`, let's look at using our own custom handlebars helper to list the length of our array.
We'll start by creating a new `arr-length` helper from the command line:

```
ember g helper arr-length
```

This new helper will have a function that we can use to change data passed from templates into usable data.
This helps get around the fact that handlebars does not let use execute raw javascript.
The helper function receives an array of passed in attributes to the helper.
We'll destructure this array into an `arr` variable and return it's length.

```js
import Ember from 'ember';

export function arrLength([arr]/*, hash*/) {
  return arr.length;
}

export default Ember.Helper.helper(arrLength);
```

Now let's use this in our `application` template:

```handlebars
<span class="todo-count">
  <strong>{{arr-length model}}</strong> items left
</span>
```

But this is showing the number of both complete and incomplete items.
So we'll need another handlebars helper.
This one will be a bit more specific, let's call it `active-only`:

```
ember g helper active-only
```

In this helper, we'll filter down to only items where `isComplete` is false or undefined:

```js
import Ember from 'ember';

export function activeOnly([todos]/*, hash*/) {
  return todos.filter((todo) => {
    return !todo.isComplete;
  });
}

export default Ember.Helper.helper(activeOnly);
```

Now we can use a combination of these `arr-length` and `active-only` in our template similar to functional programming practices:

```handlebars
<span class="todo-count">
  <strong>{{arr-length (active-only model)}}</strong> items left
</span>
```

Now our list is showing the number of items remaining.

## Responding to the URL

Now we need to turn our user's URL into which items the user should see.
To do this, we'll use Ember's router.

We'll need three routes: `index`, `active`, and `completed`.

```
ember g route index
ember g route active
ember g route completed
```

Now let's look at the `active` route handler.
Here, we can set up a model hook:

```js
import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return {
      todos: this.modelFor('application'),
      filter: 'active'
    };
  }
});
```

We use `modelFor` to grab our existing data from the `application` route.
Then we set another parameter called `filter` to `active` which we will use later to know how we should filter our results.

Now if we go to `http://localhost:4200/active` our app doesn't look any different but at least it is pulling up.
Let's take the template from `application.hbs` and move it into `active.hbs`.
Now our screen is blank.

This is because of the way that Ember "nests" routes and routed templates.
Ember needs to know where we want to put the contents of our `active` route within our application.
We can do this by using the `outlet` helper in our `application` template.
So, for now our application template will only be:

```handlebars
{{outlet}}
```

And the rest of our existing handlebars will go into the `active` template.

Now, we are getting some strange results, nothing is showing up and we see our old friend saying that the `createTodo` action is not found.
But here, we can't just copy our `actions` from our application controller.
So, let's just create our `actions` object but with empty methods after generating a controller for `active`:

```
ember g controller index
ember g controller active
ember g controller completed
```

```js
import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    createTodo(title, ev) {

    },

    deleteTodo(todo) {

    },

    saveTodo(todo) {

    },
  },
});
```

Look!
A wild error has appeared!
We are now seeing `todos.filter is not a function` since our `active-only` helper is trying to run `filter` on the `model` for our `active` route.
But, if we remember the `model` hook that we just created, the list of todos is actually `models.todos` not just `model`.
So we'll need to update our `active` template:

```handlebars
{{log model.todos}}

<section class="todoapp">
  <header class="header">
    <h1>todos</h1>
    <form onsubmit={{action "createTodo" newTitle}}>
      {{input value=newTitle class="new-todo" placeholder="What needs to be done?" autofocus=true}}
    </form>
  </header>
  <!-- This section should be hidden by default and shown when there are todos -->
  <section class="main">
    <input class="toggle-all" type="checkbox">
    <label for="toggle-all">Mark all as complete</label>
    <ul class="todo-list">
      {{#each model.todos as |todo|}}
        {{todo-item todo=todo onupdate=(action 'saveTodo') ondestroy=(action 'deleteTodo')}}
      {{/each}}
    </ul>
  </section>
  <!-- This footer should hidden by default and shown when there are todos -->
  <footer class="footer">
    <!-- This should be `0 items left` by default -->
    <span class="todo-count">
      <strong>{{arr-length (active-only model.todos)}}</strong> items left
    </span>
    <!-- Remove this if you don't implement routing -->
    <ul class="filters">
      <li>
        <a class="selected" href="#/">All</a>
      </li>
      <li>
        <a href="#/active">Active</a>
      </li>
      <li>
        <a href="#/completed">Completed</a>
      </li>
    </ul>
    <!-- Hidden if no completed items are left ↓ -->
    <button class="clear-completed">Clear completed</button>
  </footer>
</section>
<footer class="info">
  <p>Double-click to edit a todo</p>
  <!-- Remove the below line ↓ -->
  <p>Template by <a href="http://sindresorhus.com">Sindre Sorhus</a></p>
  <!-- Change this out with your name and url ↓ -->
  <p>Created by <a href="http://todomvc.com">you</a></p>
  <p>Part of <a href="http://todomvc.com">TodoMVC</a></p>
</footer>
```

Now we need to make sure that our actions are properly being run at the application level.

To run actions from other controllers, we can use `Ember.inject.controller` to dependency inject any controller that we want.
Here, we'll inject the `application` controller into `app/controllers/active.js`:

```js
import Ember from 'ember';

export default Ember.Controller.extend({
  appController: Ember.inject.controller('application'),

  actions: {
    createTodo() {

    },

    deleteTodo() {

    },

    saveTodo() {

    },
  },
});
```

Then we can look up our `appController` and use `send` to dispatch our different actions.
Here we'll use the spread operator to pass all of our arguments to the application controller actions:

```js
import Ember from 'ember';

export default Ember.Controller.extend({
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
```

But, we have a problem...
Even though we have our application controller model changing, it doesn't look like things are updating on our active page...
So now we can make a small change, instead of using `model.todos` in our template, let's use `appController.model`:

```handlebars
{{log appController.model}}

<section class="todoapp">
  <header class="header">
    <h1>todos</h1>
    <form onsubmit={{action "createTodo" newTitle}}>
      {{input value=newTitle class="new-todo" placeholder="What needs to be done?" autofocus=true}}
    </form>
  </header>
  <!-- This section should be hidden by default and shown when there are todos -->
  <section class="main">
    <input class="toggle-all" type="checkbox">
    <label for="toggle-all">Mark all as complete</label>
    <ul class="todo-list">
      {{#each appController.model as |todo|}}
        {{todo-item todo=todo onupdate=(action 'saveTodo') ondestroy=(action 'deleteTodo')}}
      {{/each}}
    </ul>
  </section>
  <!-- This footer should hidden by default and shown when there are todos -->
  <footer class="footer">
    <!-- This should be `0 items left` by default -->
    <span class="todo-count">
      <strong>{{arr-length (active-only appController.model)}}</strong> items left
    </span>
    <!-- Remove this if you don't implement routing -->
    <ul class="filters">
      <li>
        <a class="selected" href="#/">All</a>
      </li>
      <li>
        <a href="#/active">Active</a>
      </li>
      <li>
        <a href="#/completed">Completed</a>
      </li>
    </ul>
    <!-- Hidden if no completed items are left ↓ -->
    <button class="clear-completed">Clear completed</button>
  </footer>
</section>
<footer class="info">
  <p>Double-click to edit a todo</p>
  <!-- Remove the below line ↓ -->
  <p>Template by <a href="http://sindresorhus.com">Sindre Sorhus</a></p>
  <!-- Change this out with your name and url ↓ -->
  <p>Created by <a href="http://todomvc.com">you</a></p>
  <p>Part of <a href="http://todomvc.com">TodoMVC</a></p>
</footer>
```

Now our application controller is responsible for the list of all of our todos.

## Filtering Todos

We still have a problem where our app isn't filtering the list.
Luckily, we've created an `active-only` helper.
So, we can update our `each` loop to use this filter before our each loop:

```handlebars
{{#each (active-only appController.model) as |todo|}}
  {{todo-item todo=todo onupdate=(action 'saveTodo') ondestroy=(action 'deleteTodo')}}
{{/each}}
```

## Nested Routes

When looking at the different routes in our app, let's narrow down to the smallest unit of changing functionality...

The `todo-list` unordered list and its contents are the only part of our app that changes from URL to URL.
So, everything else can be shared.

In a previous post, we used components to minimize duplication, but this would still give a fair amount of repetition in our templates.
Instead, we can use Ember's nested routes to our advantage.

We can move our shared UI back to our `application` template and then only have our each loop in the `active` template.
So now our `application` template is:

```handlebars
<section class="todoapp">
  <header class="header">
    <h1>todos</h1>
    <form onsubmit={{action "createTodo" newTitle}}>
      {{input value=newTitle class="new-todo" placeholder="What needs to be done?" autofocus=true}}
    </form>
  </header>
  <!-- This section should be hidden by default and shown when there are todos -->
  <section class="main">
    <input class="toggle-all" type="checkbox">
    <label for="toggle-all">Mark all as complete</label>
    {{outlet}}
  </section>
  <!-- This footer should hidden by default and shown when there are todos -->
  <footer class="footer">
    <!-- This should be `0 items left` by default -->
    <span class="todo-count">
      <strong>{{arr-length (active-only model)}}</strong> items left
    </span>
    <!-- Remove this if you don't implement routing -->
    <ul class="filters">
      <li>
        <a class="selected" href="#/">All</a>
      </li>
      <li>
        <a href="#/active">Active</a>
      </li>
      <li>
        <a href="#/completed">Completed</a>
      </li>
    </ul>
    <!-- Hidden if no completed items are left ↓ -->
    <button class="clear-completed">Clear completed</button>
  </footer>
</section>
<footer class="info">
  <p>Double-click to edit a todo</p>
  <!-- Remove the below line ↓ -->
  <p>Template by <a href="http://sindresorhus.com">Sindre Sorhus</a></p>
  <!-- Change this out with your name and url ↓ -->
  <p>Created by <a href="http://todomvc.com">you</a></p>
  <p>Part of <a href="http://todomvc.com">TodoMVC</a></p>
</footer>
```

Notice that we switched back to using `model` instead of `appController.model` since we are bound to the context of our application controller already.
And where we used to have our `todo-list` element, we have put our `outlet` so that child routes can be rendered.

And our `active` template now becomes pretty small and sweet:

```hbs
<ul class="todo-list">
  {{#each (active-only appController.model) as |todo|}}
    {{todo-item todo=todo onupdate=(action 'saveTodo') ondestroy=(action 'deleteTodo')}}
  {{/each}}
</ul>
```

## Navigating Through Our App

While our app is responding to the url for `http://localhost:4200/active`, there's no good way for end-users to navigate around our app.
In our application route, we have a navigation area that already has three links.
But these are using hash values and Ember is not responding.

Instead, we can use the Ember `link-to` component to link around our app without forcing a page reload.
The `link-to` component looks fairly similar to HTML anchor tags, but instead of a url `href`, the name of the route we want to navigate to is passed as a first argument:

```handlebars
<ul class="filters">
  <li>
    {{#link-to "index"}}All{{/link-to}}
  </li>
  <li>
    {{#link-to "active"}}Active{{/link-to}}
  </li>
  <li>
    {{#link-to "completed"}}Completed{{/link-to}}
  </li>
</ul>
```

One last feature we will want is to be able to see what page we are on.
Ember `link-to` will add an `active` class when the URL for the link matches the current app url.
However, the CSS that shipped with TodoMVC uses a `selected` class to show this type of interaction.
Luckily, this is easy to configure by passing a `activeClass` attribute to the `link-to` component:

```handlebars
<ul class="filters">
  <li>
    {{#link-to "index" activeClass="selected"}}All{{/link-to}}
  </li>
  <li>
    {{#link-to "active" activeClass="selected"}}Active{{/link-to}}
  </li>
  <li>
    {{#link-to "completed" activeClass="selected"}}Completed{{/link-to}}
  </li>
</ul>
```

## Implementing Repeated Functionality

So far, our `active` page works, but our `completed` and home pages are both blank.
We could copy the controller for `active` to use for `completed` and `index`, but I don't like to repeat myself.
Instead, we can use Ember mixins to centralize shared functionality.
We'll start by generating our new mixin:

```
ember g mixin todo-controller-actions
```

And now, we can copy the contents of the `active` controller into this mixin:

```js
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
```

Then we can use our mixin so that the controllers for `active`, `index`, and `completed` all will be:

```js
import Ember from 'ember';
import TodoControllerActions from '../mixins/todo-controller-actions';

export default Ember.Controller.extend(TodoControllerActions, {
});
```

Now, we need to work on our templates for `index`:

```handlebars
<ul class="todo-list">
  {{#each appController.model as |todo|}}
    {{todo-item todo=todo onupdate=(action 'saveTodo') ondestroy=(action 'deleteTodo')}}
  {{/each}}
</ul>
```

But for completed we will need a new helper for `complete-only`.
Luckily, we can duplicate our `active-only`, but just change the filter parameter:

```js
import Ember from 'ember';

export function completOnly([todos]/*, hash*/) {
  return todos.filter((todo) => {
    debugger;
    return !!todo.isComplete;
  });
}

export default Ember.Helper.helper(completOnly);
```
