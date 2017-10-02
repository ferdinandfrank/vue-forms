/***********************************************************
 Load VueJS
 --------------------------
 Vue is a modern JavaScript library for building interactive web interfaces
 using reactive data binding and reusable components. Vue's API is clean
 and simple, leaving you to focus on building your next great project.
 ************************************************************/
window.Vue = require('vue');


/***********************************************************
 Load JQuery
 --------------------------
 JQuery is used for selections of HTML elements and to submit the forms.
 ************************************************************/
window.$ = window.jQuery = require('jquery');
$.ajaxSetup({
    headers: {'X-CSRF-TOKEN': Laravel.csrfToken}
});


/***********************************************************
 Load Moment
 --------------------------
 Moment is a javascript library that we can use to format dates
 It's similar to Carbon in PHP so we mostly use it to format
 dates that are returned from our Laravel Eloquent models
 ************************************************************/
window.moment = require('moment');


/***********************************************************
 Load Sweet Alert
 --------------------------
 A beautiful replacement for JavaScript's "alert"
 ************************************************************/
let alertPackage = 'sweetalert';
if (typeof VUE_FORMS_ALERT_PACKAGE !== 'undefined' && VUE_FORMS_ALERT_PACKAGE !== null) {
    alertPackage = VUE_FORMS_ALERT_PACKAGE;
}
require(alertPackage);