# Building Todo MVC from Scratch Using Ember CLI

## Creating a new Project

Right now Ember-CLI is in a bit of a teenage stage.
While the 1.13.x branch of Ember CLI is crazy stable, I would rather get the benefits of building apps using hot style reloading and alot of the performance upgrades available in the 2.x beta versions.
This means, we'll need to install the beta version of CLI:

```bash
npm install -g ember-cli@2.3.0-beta.1
```

Now once we have this, we can create a new Ember project:

```bash
ember new todo-mvc
```

Now we have a lot of files, but we can get started.

## Assets

The first task we have to tackle is getting the Todo MVC styles and such into our app.
A quick `bower search todo` yields: `bower todomvc-app-css#*      not-cached git://github.com/tastejs/todomvc-app-css.git#*`.

Score!

We don't have to do too much to get things into our app from there.
Looking at the `bower_components/todomvc-app-css` folder, we have a `base.css` file.
We'll have to get that into our build steps.

To pull in third-party JS or CSS, we can go to `ember-cli-build.js` in our project and import the CSS into our build pipeline.
After the creation of `app`, let's import our the `base.css` file we found earlier:

```js
var app = new EmberApp(defaults, {
  // Add options here
});

app.import('bower_components/todomvc-app-css/index.css');
```

Now when we build our app, the `base.css` from Todo MVC will be wrapped, minified, and imported directly into our final app.

That brings us to making our first build.
While we can run `ember build` to make a one off build of our project, `ember serve` will be more helpful since it continuously builds our projects after changes and serves things up on `http://localhost:4200`.

Now if we look at our app in the browser, we can see maybe there's some background to our app and we have a heading that says "Welcome to Ember".

## Creating the Base Markup

Now we need to add some HTML into our app to make it actually look like TodoMVC.
If we go to the [template HTML for TodoMVC](https://github.com/tastejs/todomvc-app-template/blob/master/index.html), we can grab all of the contents of `section` and `footer` and copy them.

Ok.
We have some HTML, but where can we put it?

In Ember, our app is built of nested sets of routed Handlebars templates (more on routes in a bit).
At the top of this hierarchy of nesting is the template in `app/templates/application.hbs`.
This template will wrap and be shown for everything within our app.
If we open this file, we'll see the "Welcome to Ember" heading we saw in the browser.
Let's paste the HTML we got from TodoMVC template so that our application template looks like this:

```htmlbars
<section class="todoapp">
  <header class="header">
    <h1>todos</h1>
    <input class="new-todo" placeholder="What needs to be done?" autofocus>
  </header>
  <!-- This section should be hidden by default and shown when there are todos -->
  <section class="main">
    <input class="toggle-all" type="checkbox">
    <label for="toggle-all">Mark all as complete</label>
    <ul class="todo-list">
      <!-- These are here just to show the structure of the list items -->
      <!-- List items should get the class `editing` when editing and `completed` when marked as completed -->
      <li class="completed">
        <div class="view">
          <input class="toggle" type="checkbox" checked>
          <label>Taste JavaScript</label>
          <button class="destroy"></button>
        </div>
        <input class="edit" value="Create a TodoMVC template">
      </li>
      <li>
        <div class="view">
          <input class="toggle" type="checkbox">
          <label>Buy a unicorn</label>
          <button class="destroy"></button>
        </div>
        <input class="edit" value="Rule the web">
      </li>
    </ul>
  </section>
  <!-- This footer should hidden by default and shown when there are todos -->
  <footer class="footer">
    <!-- This should be `0 items left` by default -->
    <span class="todo-count">
      <strong>0</strong> item left</span>
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

In our browser, we can see the standard TodoMVC app.
It looks nice, but nothing is working...
Let's start fixing that.

## Submitting a New Todo

To get started we need to modify our markup a bit.
For accessibility and submit capturing, let's wrap the `new-todo` input in a `form` tag:

```htmlbars
<form>
  <input class="new-todo" placeholder="What needs to be done?" autofocus>
</form>
```

Now we need to listen for our user to submit this input (with the "Enter" key most likely).
We can add an `onsubmit` handler to the `form` HTML, but we need a way to let Ember know that something has been triggered from our template.
To do this, we will use the `action` helper which allows us to capture user interaction and send it into Javascript where we can manipulate it.
We'll call this new action `createTodo`:

```htmlbars
<form onsubmit={{action "createTodo"}}>
  <input class="new-todo" placeholder="What needs to be done?" autofocus>
</form>
```

If we try to load up our app in the browser, things will be broken and in our console we'll see a new error:

> Uncaught Error: An action named 'createTodo' was not found in (generated application controller).

This error means that we don't have anything in our Javscript to handle `createTodo`.
So, let's first create a controller which will allow us to handle this user interaction.
To go along with our `application` template, we'll need an `application` controller.
Similar to Rails, we can generate this from the command line:

```htmlbars
ember g controller application
```

Now we will have a new file `app/controllers/application.js`:

```js
import Ember from 'ember';

export default Ember.Controller.extend({
});
```

But, our app is still not working.
We need to create an "action handler" for the `createTodo` action within an `actions` object in our controller:

```js
import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    createTodo() {

    }
  }
});
```

Now our app is loading, but if we hit enter, our page refreshes...
Well, if we recall jQuery days, we need to prevent default.
So, let's stick a `debugger` in the new `createTodo` method and see if we can figure out what we have to work with.

If we submit from the input and have our console open, we can inspect the values of `arguments` and see that Ember has passed along the DOM event from the form submitting.
So, let's add another argument to our `createTodo` method and prevent default:

```js
import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    createTodo(ev) {
      ev.preventDefault();
    }
  }
});
```

Now we have a new way to capture user input, but we don't have a clean way to get WHAT the user has inputted.

Let's go back to our `application` template and work on this.
Instead of using the native `input` element, we'll look at using Ember's `input` component.

Components in Ember are similar to standard HTML elements in that they have a name and arguments, but they also bring in some extra UI implementations.
For instance the `input` component in Ember will allow us to listen for changes and update a property on our `application` controller.
To use the `input` component, let's just replace the angle brackets with `{{` and `}}`:

```htmlbars
{{input class="new-todo" placeholder="What needs to be done?" autofocus=true}}
```

> **NOTE** since we want the input to autofocus, we modified that attribute to say `autofocus=true`

Now we can make our input live update a property on our controller named `newTitle` by setting a `value` attribute to `newTitle`:

```htmlbars
{{input value=newTitle class="new-todo" placeholder="What needs to be done?" autofocus=true}}
```

> **Note** we are not using quotes here because we want to use JavaScript values not string literals

Ok...
So we're changing a value called `newTitle` in our controller when the user inputs data.
How do we grab that?

To the `action` helper after the action name, we can pass in a second parameter for data that we want to send along with the DOM event, in this case, our `newTitle` value:

```htmlbars
<form onsubmit={{action "createTodo" newTitle}}>
  {{input value=newTitle class="new-todo" placeholder="What needs to be done?" autofocus=true}}
</form>
```

When we specify an argument for our action, it does come in as the first argument to our action handler.
Let's grab that value as `title` and log it to the console.

```js
import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    createTodo(title, ev) {
      ev.preventDefault();
      console.log(title);
    }
  }
});
```

Woo!
We've logged some input!
Now to submit this to the server.

## Submitting Todos to an API

For this tutorial, we'll be submitting to my API that is described in [this article](http://ryantablada.com/post/creating-a-simple-todo-mvc-api-with-api-kit).
I have hosted this API on Heroku at `http://todo-mvc-api.herokuapp.com/api/todos`.

We'll use the browser `fetch` to post to our API:

> **NOTE** `fetch` is not implemented in all browsers, we'll fix this when we get to addons, but for now use latest Chrome or Firefox

```js
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
      });
    }
  }
});
```

If we look at our network tab, we'll see that we have made a OPTIONS request, but it doesn't look like our POST went through.
But in the `XHR` tab, nothing is showing up...
This is because the native `fetch` implementations will be listed under `Other` (at least for now).
Let's turn our results into a JSON object and log it to the console to check that the server is responding.

```js
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
```

## Clearing Out Our input

After we know that the user's todo has been saved, let's reset our input.
We can do this by using `Ember.set` to set the value of our `newTitle` for our controller to an Empty string.
We have to use the `Ember.set` method so that our template context is notified of the underlying changes.
Here, we start by destructuring the `set` method from the `Ember` object, then calling set after our fetch has finished.
`Ember.set` takes three arguments: the object to change values on, the name of the property to be changed, and the new value to be set.

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
        });
    }
  }
});
```

In the next article, we'll grab some data from our server so that our todo list starts filled out.
