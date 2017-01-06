# Vue Forms

Vue Forms provides a collection of vue.js form and input components to create pretty ajax requests.

### Requirements

- [PHP](https://php.net) >= 5.6
- An existing [Laravel 5.3](https://laravel.com/docs/master/installation) project

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
    
5. Since the Vue Forms components are written in vue.js 2.0 you'll need to use webpack or another bundler to get the code ready for the browser. You can then bundle these with your existing scripts in your projects gulpfile.js, for example:

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
 
 6. Now you can run `gulp` as usual.
    
    
... full documentation coming soon