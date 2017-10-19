/***********************************************************
 Load VueJS
 --------------------------
 Vue is a modern JavaScript library for building interactive web interfaces
 using reactive data binding and reusable components. Vue's API is clean
 and simple, leaving you to focus on building your next great project.
 ************************************************************/
window.Vue = require('vue');


/***********************************************************
 Load jQuery
 --------------------------
 jQuery is a fast, small, and feature-rich JavaScript library.
 It makes things like HTML document traversal and manipulation, event handling, animation, and Ajax much simpler with
 an easy-to-use API that works across a multitude of browsers. With a combination of versatility and extensibility,
 jQuery has changed the way that millions of people write JavaScript.
 ************************************************************/
window.$ = window.jQuery = require('jquery');

/**
 * Next we will register the CSRF Token as a common header with jQuery so that
 * all outgoing HTTP requests automatically have it attached. This is just
 * a simple convenience so we don't have to attach every token manually.
 */
let token = document.head.querySelector('meta[name="csrf-token"]');
if (token) {
    $.ajaxSetup({
        headers: {'X-CSRF-TOKEN': token.content}
    });
} else {
    console.error('CSRF token not found: https://laravel.com/docs/csrf#csrf-x-csrf-token');
}


/***********************************************************
 Load Moment
 --------------------------
 Moment is a javascript library that we can use to format dates
 It's similar to Carbon in PHP so we mostly use it to format
 dates that are returned from our Laravel Eloquent models
 ************************************************************/
window.moment = require('moment');
moment.locale('de');

/***********************************************************
 Load Select2
 --------------------------
 Select2 gives you a customizable select box with support for searching,
 tagging, remote data sets, infinite scrolling, and many other highly used options.
 ************************************************************/
require('../vendor/select2/js/select2');
require('../vendor/select2/js/i18n/de');

/***********************************************************
 Load Sweet Alert
 --------------------------
 A beautiful replacement for JavaScript's "alert"
 ************************************************************/
if (typeof VUE_FORMS_USE_SWEETALERT !== 'undefined' && VUE_FORMS_USE_SWEETALERT !== null) {
    require('sweetalert');
}
