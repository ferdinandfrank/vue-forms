/***********************************************************
 Vue Forms: Main File
 --------------------------
 Loads all necessary scripts for the vue forms package.
 ************************************************************/

require('./config');
require('./requirements');
require('./internationalization');
require('./helpers/helper');
require('./components');
require('./vendor/datetimepicker');


/**
 * If it doesn't already exist, register a separate empty vue instance that
 * is attached to the window, we can use it to listen out for and handle
 * any events that may emitted by components...
 */
if (!window.eventHub) {
    window.eventHub = new Vue();
}
