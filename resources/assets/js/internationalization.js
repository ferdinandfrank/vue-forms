/***********************************************************
 Vue Forms: Internationalization
 --------------------------
 Inits the necessary internationalization for the vue forms to show appropriate messages.
 ************************************************************/

// Load the Vue internationalization package
import VueInternationalization from "vue-i18n";
Vue.use(VueInternationalization);

// Load internationalized messages
import importedLocales from './locales';
let locales = importedLocales;
if (typeof VUE_FORMS_LOCALES !== 'undefined' && VUE_FORMS_LOCALES !== null) {
    locales = VUE_FORMS_LOCALES;
}
const messages = locales;

let supportedLocales = ['en'];
if (typeof VUE_FORMS_SUPPORTED_LOCALES !== 'undefined' && VUE_FORMS_SUPPORTED_LOCALES !== null) {
    supportedLocales = VUE_FORMS_SUPPORTED_LOCALES;
}

// Read and set the current locale from the url or set default one (if none is specified in the url)
let locale = window.location.pathname.split('/')[1];
if (locale === null || supportedLocales.indexOf(locale) < 0) {
    locale = supportedLocales[0];
}
Vue.config.lang = locale;

// Create VueI18n instance with options
window.i18n = new VueInternationalization({
    locale: locale, // set locale
    messages // set locale messages
});