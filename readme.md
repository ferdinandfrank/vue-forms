<h1 style="text-align:center;">Vue.js Forms</h1>

[![GitHub package version](https://img.shields.io/github/package-json/v/badges/shields.svg)](https://github.com/ferdinandfrank/vue-forms)
[![Packagist](https://img.shields.io/packagist/dt/ferdinandfrank/vue-forms.svg)](https://packagist.org/packages/ferdinandfrank/vue-forms)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

<b style="color: red;">Warning: This package is not maintained anymore!</b>

This package provides a collection of [Vue.js](https://vuejs.org/) form and input components to create pretty and easy ajax requests on a Laravel application.

Full documentation: [https://ferdinandfrank.github.io/vue-forms/](https://ferdinandfrank.github.io/vue-forms/)

## Example

HTML form with two input components which get cleared after the submit. Additionally a success alert message will be shown after the server processed the request.
   
In your HTML / Blade file:

```html
<ajax-form method="[METHOD]" action="[ACTION]" :clear="true">
    <form-input name="name" label="Name" :value="MyName"></form-input>
    <form-select name="gender" label="Gender" :value="m">
       <option value="m">Male</option>
       <option value="f">Female</option>
    </form-select>
    
    <button type="submit">Submit</button>
</ajax-form>
```
    
In your controller method:

```php
public function handleRequest(Request $request) {
   // Handle the request

   return response()->json([
       'alert' => [
           'title'   => 'Success',
           'message' => 'Request was successful!',
           'accept'  => 'Alright!'
       ]
   ]);
}
```

## Requirements
### Server Requirements
- [PHP](https://php.net) >= 7.0
- An existing >= [Laravel 5.4](https://laravel.com/docs/master/installation) project

### JS Requirements
There are a few requirements of your Laravel application for the package to work properly on the client side. 
You can install them by just including the according entries in your `package.json` file (see [Installation](#installation) #4).

#### Mandatory
- [Vue.js](https://vuejs.org/) >= 2.1.10: _To render the Vue.js components._
- [Lodash](https://lodash.com/) >= 4.17.4: _For using JS helper functions in the scripts which makes the code cleaner_
- [MomentJS](https://momentjs.com/) >= 2.18.1: _For date formatting on JS_
- [JQuery](https://jquery.com/) >= 3.1.1: _For element selection and ajax requests_

#### Optional
- [Bootstrap](https://getbootstrap.com/) >= 3.3.7: _For the design of the input components_
- [Sweetalert](https://sweetalert.js.org/) >= 2.0.4: _To show pretty alert / confirm messages_
- [Tooltip.js](https://popper.js.org/tooltip-examples.html) >= 1.1.5: _To show help texts on the inputs as a pretty tooltip_

### Optional Requirements
To show a loading icon when a form gets submitted as well as to show a help icon next to the inputs, [Font Awesome](http://fontawesome.io/icons/) will be used.
[Font Awesome](http://fontawesome.io/icons/) need to be installed properly on the application to show these icons. Otherwise the components need to be configured.

The HTML content of the components is designed for the usage with [Bootstrap 4](https://getbootstrap.com/). 
To have a nice design of the inputs out of the box, Bootstrap is required.


## Installation

1. To get started, install the package via the Composer package manager: 

    ```bash
    composer require ferdinandfrank/vue-forms
    ```
   
2. In Laravel >= 5.5 this package registers automatically. For previous Laravel versions add the following entry to your providers array in `config/app.php`:
    
    ```php
    'providers' => [
       ...
       ...
       \FerdinandFrank\VueForms\Providers\VueFormsServiceProvider::class
    ]
    ```
    
3. Publish the Vue.js components and other scripts to the `resources/assets/vendor/vue-forms` folder, so you can edit and include the package's files within you application's scripts:

    ```bash
    php artisan vue-forms:init
    ```
    
4. Add the following entries to the `dependencies` array in your `package.json` file, if these do not yet exist. The first four are required, the last four (sweetalert, bootstrap-sass, popper.js, tooltip.js) optional (see [Optional Requirements](#optional)).

    ```json
    "dependencies": {
        "vue": "^2.1.10",
        "lodash": "^4.17.4",
        "jquery": "^3.1.1",
        "moment": "^2.18.1",
        "sweetalert": "^2.0.4",
        "bootstrap-sass": "^3.3.7",
        "popper.js": "^1.12.5",
        "tooltip.js": "^1.1.5"
      }
    
     ```    
    
5. Include the main JS within your application's script, e.g., from `resources/assets/js/app.js` copy the following statement:

      ```javascript
      require('../vendor/vue-forms/js/vue-forms');
      ```    
      
6. Include the main SCSS within your application's script, e.g., from `resources/assets/sass/app.scss` copy the following statement:

    ```scss
    @import "../vendor/vue-forms/scss/vue-forms";
    ```  
    
7. Compile your scripts via webpack or any other compiler.    
    
That's it! You can now use the Vue.js components of this package.
    
## Documentation
[Click here for the full documentation](https://ferdinandfrank.github.io/vue-forms)

## License
[MIT](https://github.com/ferdinandfrank/vue-forms/blob/master/LICENSE)
