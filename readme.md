# Vue Forms

Vue Forms provides a collection of vue.js form and input components to create pretty ajax requests.

### Requirements
##### Mandatory Requirements
- [PHP](https://php.net) >= 5.6
- An existing [Laravel 5.3](https://laravel.com/docs/master/installation) project

##### Optional Requirements
- **[ContentTools](http://getcontenttools.com/) >= 1.3:** Necessary for the component _FormCodearea_
- **[Bootstrap 3 Datepicker](https://eonasdan.github.io/bootstrap-datetimepicker/) >= 4.17.43:** Necessary for the components _FormDateInput_ and _FormDateTimeInput_

### Installation

1. To get started, install the Vue Forms extension via the Composer package manager: 

    ```bash
    composer require epicarrow/vue-forms
    ```
    
2. Add the following entry to your providers array in `config/app.php`:
    
    ```php
    'providers' => [
       ...
       ...
       EpicArrow\VueForms\Providers\VueFormsServiceProvider::class
    ]
    ```

3. Initialize the package and publish the resources to `/resources/assets/vendor`:

    ```bash
    php artisan vue-forms:init
    ```
    
4. On default an localization file (`locales.js`) is used to show localized texts on the alerts. Feel free to 
adapt the path to your own localization file in `/resources/assets/vendor/vue-forms/js/config.js`. 

5. Delete the components, that you don't want to use. Please notice that some components like _FormCodearea_ and _FormDateInput_ have some requirements (Check the section "Optional Requirements"), 
so if you don't want to use these components und you don't fulfill these requirements, you have to delete these components, otherwise you will get an error, when running `gulp`.

6. Since the Vue Forms components are written in vue.js 2.0 you'll need to use webpack or another bundler to get the code ready for the browser. You can then bundle these with your existing scripts in your projects gulpfile.js, for example:

    ```javascript
    const elixir = require('laravel-elixir');
    
    require('laravel-elixir-vue-2');
    
    let assetsPath = 'public/';
    elixir((mix) => {
    
        mix.webpack([
            'app.js',
            '../vendor/vue-forms/js/vue-forms.js',
        ], assetsPath + 'js/app.js');
    
        mix.sass([
            'app.scss',
            '../vendor/vue-forms/sass/vue-forms.scss',
        ], assetsPath + 'css/app.css');
    
        // Copy fonts
        mix.copy('resources/assets/fonts', assetsPath + '/fonts');
    });
    ```
 
7. Now you can run `gulp` as usual.
    
### Documentation
The following components are included in the Vue Forms composer package:

#### Ajax Form
Represents a standard form component.