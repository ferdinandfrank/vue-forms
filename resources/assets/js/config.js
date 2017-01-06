
import locales from './locales';
let supportedLocales = ['en', 'de'];

import VueInternationalization from "vue-i18n";
Vue.use(VueInternationalization);

let locale = window.location.pathname.split('/')[1];
if (locale == null || supportedLocales.indexOf(locale) < 0) {
    locale = supportedLocales[0];
}
Vue.config.lang = locale;

Object.keys(locales).forEach(function (lang) {
    Vue.locale(lang, locales[lang])
});