# Ember CLI TodoMVC Retrieving Data

In the last post, we were able to create a new todo, but we did nothing to actually list existing todos.
So in this post we'll review grabbing our existing todos and showing the new todo in our list.

## Ember Routes

Ember is built around turning the URL into state that the user can interact with.
At the heart of this is the Ember Router and Route handlers.
Just like our controller is the active state backing our template, the Route handler defines how we can get data in and out of our app given a particular URL.

Let's create an `application` route handler so that we can grab data from our server.

```
ember g route application
```

This will ask to overwrite our existing template, choose `N` to make sure we don't kill our progress so far.

## Loading Data into Templates

Ember Route handlers have a `model` method that will be called and the result will be available in our template and controller as `model`.
So let's start by returning an array of todo items from the `model` hook in our `app/routes/application.js`:

```js
import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return [
      {
        id: '1',
        title: 'Buy Milk'
      },
      {
        id: '2',
        title: 'Laundry'
      }
    ];
  }
});
```

Now let's go to our `app/templates/application.hbs` so that we can see our new `model` data.
To start with, let's just log out the `model` value from our template using the `log` helper:

```hbs
{{log model}}
```

And if we open the console, our array from the `model` method is right there.

## Showing Data From templates

So, we have a `model` value in our template, but we need to loop through it and show the `title` attribute to our users.
In Handlebars, we can use the `each` helper which works similar to Ruby's `each` loop or PHP's `foreach`.
We need a place to loop through and repeat some DOM.
Looks like the `todo-list` `ul` will be the perfect place for this.
Let's create an `each` loop over our `model` value and put the existing `li` markup into it:

```hbs
<ul class="todo-list">
  {{#each model as |todo|}}
    <li class="completed">
      <div class="view">
        <input class="toggle" type="checkbox" checked>
        <label>Taste JavaScript</label>
        <button class="destroy"></button>
      </div>
      <input class="edit" value="Create a TodoMVC template">
    </li>
  {{/each}}
</ul>
```

Now we have a few repeated crossed out todos in our browser, but the todos are all saying "Taste Javascript".
So let's use Handlebars to show the titles from our todos.
Here, we have to look more at the `each` loop.
We are creating a local variable called `todo` which will represent the current todo item in our `model` array.
Then using handlebars, we can print out the value of our `todo.title` anywhere we need to within the bounds of our `each` loop.

```hbs
<ul class="todo-list">
  {{#each model as |todo|}}
    <li class="completed">
      <div class="view">
        <input class="toggle" type="checkbox" checked>
        <label>{{todo.title}}</label>
        <button class="destroy"></button>
      </div>
      <input class="edit" value="{{todo.title}}">
    </li>
  {{/each}}
</ul>
```

If we check in the browser, we'll have two todos that say "Buy Milk" and "Laundry".

## Fetching Data From the Server

Now, let's start to fetch data from our server instead of hard coding an array of data.
Here, we'll use the browser `fetch` API again:

```js
import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return fetch('http://todo-mvc-api.herokuapp.com/api/todos')
      .then((response) => response.json())
      .then((data) => data.todos);
  }
});
```

There are a few things to note here.
The `model` hook in our Route handler is aware of promises.
This means that it will wait for promises to resolve before rendering the page and sending the final resolved result as `model` to the template.
We create our fetch request, then parse it to JSON and then grab the `todos` property from the resulting data.

So...
Depending on the activity on the API server, you'll see a different list of todos.
No need to update our template!

## Updating the List After New Todos

Right now our app is read only until we refresh and see todos that we've submitted.
So...
Let's go ahead and add new todos to the list of todos once things have saved.

So in our `app/controller/application.js`, let's put a `debugger` in `createTodo` after logging out the result.

```js
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
      debugger;
    });
}
```

Now if we submit a new todo, let's poke around in the console to see what we can do.
We'll need to know what our existing list of todos is.
So let's explore what the value of `this` is in our `debugger`.

Looks like `this` is `undefined`?
What's going on?

Ember CLI is using Babel under the hood to turn our nice pretty ES6 arrow functions into regular ES5.
So the current context is actually `_this` in our browser console.

Ok!
That's better, `_this` gives us a pretty scary looking "Class" object.
If we drill it down, we'll see `get` and `set` for the `model` property.
So let's type in `_this.model` to see it's value and now we should have our array of existing todos.

Now, we can add the new todo to the existing list.
While we could use `push` or `unshift` to add items to our existing array, it won't trigger a re-render in Ember.
Also, given the rise of more immutable Javascript, let's try to create a new array instead:

```js
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
    });
}
```

Here, we use the ES6 spread operator to make a new array with our new array at the front.
So we've created our immutable array of all of our todos, but we haven't re-rendered.
So we can use the `set` function to reset our `model` value and force a re-render:

```js
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
}
```

And there we go!
Our list is updating and all of our results are showing up!

In the next post, we'll look at updating and deleting records.
