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

Now your application is ready and all that's left is extending it!

## n-*

### n-data-source

n-data-source is used to specify a data-source for a parent element. This element will pass its data down to its children.

n-data-source can be followed by n-data-type and/or n-if. If no n-data-type is specified, then the data-type is assumed to be a controller. n-if will only work with foreach and model data-types when it comes to data-sources.

Syntax:
```
<tag n-data-source="">
  ...
</tag>
```

Examples:

```
<!-- getMenu: [{ link: '/', text: 'Home' }, { link: '/news', text: 'News' }, { link: '/contact', text: 'Contact' }] -->

<div n-data-source="getMenu">
  <a n-attr="href:link" n-data="text"></a>
</div>

...

<a href="/">Home</a>
<a href="/news">News</a>
<a href="/contact">Contact</a>
```

```
<!-- getModel: { name: 'Johnny' } -->

<div n-data-source="getModel" n-data-type="model" n-if="model|model.name !== 'Bob'">
  <h3 n-data="name"></h3>
</div>

...

<h3>Johnny</h3>

```

```
<div n-data-source="[{name:'John'},{name:'Sarah'}]" n-data-type="foreach">
  <h3 n-data="name"></h3>
</div>

...

<h3>John</h3>
<h3>Sarah</h3>
```

### n-data

n-data is used to take data from a parent's model. This can be used by all nested child elements.

Syntax:

```
<tag n-data=""></tag>
```

Example:

```
<p n-data="message"></p>
```

### n-attr

n-attr is used to set an attribute from a model's property. This can be used by all nested child elements.

Syntax:

```
<tag n-attr="attributeName:modelProperty"></tag>
```

Example:

```
<a n-attr="href:link"></a>
```

### n-if

n-if is used to only render data for an element if a specific condition is met. The condition can use the parent's model.

Syntax:

```
<tag n-if="modelAlias|conditionalExpression"></tag>
```

Example:

```
<h3 n-data="name" n-if="building|building.name && building.name.length"></h3>
```

### n-events

n-events is used to specify events that an element can be bound to. These events must be functions located in the current controller.

Syntax:

```
<tag n-events="eventName:eventFun"></tag>
```

```
<tag n-events="eventName:eventFun|eventName2:eventFun2"></tag>
```

Example:

```
<a href="#" n-events="click:onClick">Click Me</a>
```

### n-ghost

n-ghost can be used to proxy a specific member of the passed model.

n-data-source is used to specify the member to ghost.

Syntax:

```
<tag n-ghost></tag>
```

Example:

```
<div n-data-source="nestedArray" n-data-type="foreach" n-ghost">
  <p n-inline></p>
</div>
```
### n-inline

n-inline can be used to inline a model's data directly.

Syntax:

```
<tag n-inline></tag>
```

Example:

```
<div n-data-source="[1,2,3,4,5]" n-data-type="foreach">
  <p>
    Number: <span n-inline></span>!
  </p>
</div>
```

### n-sort

n-sort can be used to sort data. If no sorting expression is specified then it uses the default **array.prototype.sort** function.

The sorting expression can use **a** and **b** for sorting.

Syntax:

```
<tag n-sort></tag>
```

```
<tag n-sort="expression"></tag>
```

Example:

```
<div n-data-source="[1,2,3,4,5]" n-data-type="foreach" n-sort="a < b">
  <p>
    Number: <span n-inline></span>!
  </p>
</div>
```

### n-filter

n-filter can be used to filter elements based on a conditional expression.

The expression can use **value** to create the filter expression.

Syntax:

```
<tag n-filter="expression"></tag>
```

Example:

```
<div n-data-source="[1,2,3,4,5]" n-data-type="foreach" n-filter="value >= 3">
  <p>
    Number: <span n-inline></span>!
  </p>
</div>
```

## Responsive

Other than dynamic data rendering then nyanjs can also do complex responsive designs.

### Responsive Binding

Nyanjs can do responsive binding using the **n-resp** and **n-resp-bind** attributes.

The **n-resp** attribute must include the sizes in which the element will display content.

The **n-resp-bind** attribute must include a name which it should bind against.

The binding is against other elements with same name, but different **n-resp** values.

All values in the **n-resp** attribute are comma separated.

These are the following sizes available:

* xs (Extra Small)
* sm (Small)
* md (Medium)
* lg (Large)

If you're familiar with Bootstrap, then you should be familiar with those sizes. Caution: Nyanjs does not render the exact same sizes, but close to! That is a design choice!

Example:

```
  <div n-resp="xs,sm" n-resp-bind="responsiveBox" style="background-color: red;">
    <p>Hello</p>
  </div>
  <div n-resp="md,lg" n-resp-bind="responsiveBox" style="background-color: blue;"></div>
```

When the page is displayed with **xs,sm** then **Hello** has a red background, but when the page is displayed with **md,lg** then **Hello** has a blue background.

The binding works by moving the child content between the elements to their respective responsive size.

This is useful when you have boxes at different locations depending on sizes, but displaying same content.

It can be used to eliminate double-data!

### CSS

Other than responsive binding then nyanjs also provides a minimal css file that can be used to create grids and responsive element visibility.

Using **n-row** you can specify a row for a grid.

Using **n-col-X** where X is the amount of percentage the column should take. Each column represents 10% in nyanjs.

The range is **n-col-1** to **n-col-10**.

All elements using **n-col-X** must specify the **n-col** class too.

Using **n-width-X** you can specify an addition percentage value a column should take.

The possible values for **n-width-X** are the following: **10, 20, 25, 33, 40, 50**

You can show elements based on a responsive size using **n-visible-SIZE** where SIZE is the responsive size (xs, sm, md or lg)

You can hide elements based on a responsive size using **n-hidden-SIZE**
