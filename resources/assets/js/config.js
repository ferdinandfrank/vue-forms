/***********************************************************
 Vue Forms: Config
 --------------------------
 Holds all necessary config variables for the vue forms package.
 ************************************************************/

// States if the "sweetalert" package shall be used to show alerts produced by the vue forms 
window.VUE_FORMS_USE_SWEETALERT = true;

// The amount of ms to wait before an input's value gets validated after a change
window.VUE_FORMS_VALIDATION_TIMEOUT = 100;

// The error message to show when an unknown server error occurred during an ajax request from an ajax form component.
window.VUE_FORMS_ERROR_DEFAULT = {
    title: 'Sorry!',
    message: 'An unknown error occurred! Please try again later.',
    accept: 'Ok'
}