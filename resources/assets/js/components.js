/***********************************************************
 Vue Forms: Components
 --------------------------
 Loads all usable vue components.
 ************************************************************/

import ajaxForm from "./components/AjaxForm.vue";
import formButton from "./components/buttons/FormButton.vue";
import formInput from "./components/inputs/FormInput.vue";
import hiddenInput from "./components/inputs/HiddenInput.vue";
import formTextarea from "./components/inputs/FormTextarea.vue";
import formRadio from "./components/inputs/FormRadio.vue";
import formCheckbox from "./components/inputs/FormCheckbox.vue";
import formSwitch from "./components/inputs/FormSwitch.vue";
import formLink from "./components/buttons/FormLink.vue";
import formSelect from "./components/inputs/FormSelect.vue";
import formDateInput from "./components/inputs/FormDateInput.vue";
import formFileInput from "./components/inputs/FormFileInput.vue";
import removeButton from "./components/buttons/RemoveButton.vue";
import icon from "./components/Icon.vue";

Vue.component('ajax-form', ajaxForm);
Vue.component('form-button', formButton);
Vue.component('form-input', formInput);
Vue.component('hidden-input', hiddenInput);
Vue.component('form-textarea', formTextarea);
Vue.component('form-checkbox', formCheckbox);
Vue.component('form-radio', formRadio);
Vue.component('form-switch', formSwitch);
Vue.component('form-link', formLink);
Vue.component('form-select', formSelect);
Vue.component('form-date-input', formDateInput);
Vue.component('form-file-input', formFileInput);
Vue.component('remove-button', removeButton);
Vue.component('icon', icon);