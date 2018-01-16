# nyanjs
nyanjs is a light-weight responsive javascript library fit for both single-page and multi-page applications.

## Getting Started

### 1. Installation

First download nyanjs and place the nyanjs folder in the root of your site.

### 2. Create your application

Create a folder called "app" anywhere, by default nyanjs will look in your root path, but using **window.appPath** you can specify the path.

After that you have to create your application by creating a file called **app.js** in the app folder.

The content of the file should be as following:

```
nyan.app = nyan.define('app', {
  config: {
    files: [
      // Controllers

      // Models

      // Views
        // Templates
        '/app/views/home.html',
        // View Controllers
        '/app/views/home.js'
    ],
    
    appView: 'mainView',
    mainView: 'home'
  },

  init: function() {
    // TODO: Do stuff when the application is being initialized
  }
});
```

Within the **files** array you specify all files that should be imported by nyanjs for usage. This includes templates, controllers, models etc.

Now the page that runs your app has to look like the following as minimum:

```
<html>
  <head>
    <title>Nyanjs Application</title>

    <link href="nyanjs.css" rel="stylesheet">
    <script src="nyanjs.js"></script>
  </head>
  <body>
    <view id="mainView"></view>
  </body>
</html>
```

### 3. Create the Home view

The next thing to do is creating the home view. Views are split up in two parts. A template and a controller.

Templates are simply html pages that can utilize special attributes for dynamic rendering.

Controllers can be used to bind events and data to the elements of the template.

First let's create the template. Within a folder called **views** create a **home.html** and **home.js** file.

home.html:

```
<div n-data-source="getContent">
  <h3 n-data="title"></h3>
  <p n-data="message"></p>
</div>
```

After that we have to create the controller for the template.

In the template we specified we wanted to retrieve a model from a function called **getContent()** and we want to retrieve the following two properties from the model:

* title
* message

So let's create the controller.

home.js:

```
nyan.define('home', {
  inherit: 'nyan.ViewController',

  getContent: function(binder) {
    binder({
      title: 'Nyanjs App',
      message: 'Hello World!'
    });
  }
});
```

Functions in controllers that a template retrieves data from must set the data in the binder function that's passed.

That's because the data is initialized lazily in the template and it works well with xhr data too, since you can bind the data in the xhr callback.

