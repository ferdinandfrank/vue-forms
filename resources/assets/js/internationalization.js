/***********************************************************
 Vue Forms: Internationalization
 --------------------------
 Inits the necessary internationalization for the vue forms to show appropriate messages.
 ************************************************************/

import locales from 'locales';

if (typeof VUE_FORMS_LOCALES !== 'undefined' && VUE_FORMS_LOCALES !== null) {
    locales = VUE_FORMS_LOCALES;
}

let supportedLocales = ['de'];
if (typeof VUE_FORMS_SUPPORTED_LOCALES !== 'undefined' && VUE_FORMS_SUPPORTED_LOCALES !== null) {
    supportedLocales = VUE_FORMS_SUPPORTED_LOCALES;
}

import VueInternationalization from "vue-i18n";

Vue.use(VueInternationalization);

let locale = window.location.pathname.split('/')[1];
if (locale === null || supportedLocales.indexOf(locale) < 0) {
    locale = supportedLocales[0];
}
Vue.config.lang = locale;

Object.keys(locales).forEach(function (lang) {
    Vue.locale(lang, locales[lang])
});