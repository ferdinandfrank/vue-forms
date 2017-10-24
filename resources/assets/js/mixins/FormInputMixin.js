import Popper from 'popper.js';
import Tooltip from 'tooltip.js';

export default {

    props: {

        // The name of the input. Will also be the name of the value, when the form gets submitted.
        name: {
            type: String,
            required: true
        },

        // The predefined value of the input.
        // See data: 'submitValue'
        value: {
            type: String,
            default: ''
        },

        // The language key of the label.
        // See computed data: 'label'.
        langKey: {
            type: String
        },

        // True, if the input shall be disabled.
        disabled: {
            type: Boolean,
            default: false
        },

        // True, if a label shall be displayed above the input.
        showLabel: {
            type: Boolean,
            default: true
        },

        // Function to check if the input is valid. If it is invalid an error message,
        // based upon the property 'name' and 'langKey' will be shown to the user.
        // The function receives the current value of the input as first parameter
        // and a callback function as the second. This callback must return true,
        // if the input is valid and false otherwise.
        check: {
            type: Function
        },

        // States if a value on the input is required.
        required: {
            type: Boolean,
            default: false
        },

        // States if a popover shall be shown next to the input when an error occurred.
        popover: {
            type: Boolean,
            default: true
        },

        // The position of the popover when the 'popover' prop is set to 'true'
        popoverPosition: {
            type: String,
            default: 'right'
        },

        // The help text to show as a tooltip when hovering over the input
        help: null,

        // The position of the popover when the 'help' prop is set
        helpPosition: {
            type: String,
            default: 'right'
        },

        // The specific color of the input group
        color: null,

        // The specific size of the input group
        size: null,

        // States if errors on the input shall be ignored
        ignoreErrors: {
            type: Boolean,
            default: false
        }
    },

    data: function () {
        return {
            submitValue: '',

            labelMessage: '',

            // States if the input's value is valid.
            valid: !this.required || this.value,

            // States if the input's value is invalid.
            invalid: false,

            // The parent form components of the component.
            parentForm: '',

            // States if the input is currently focused.
            active: false,

            // The currently shown popover
            currentPopover: null,

            // States if the parent form shall be submitted when the submit value is synced on all other components.
            submitFormAfterSubmitValueIsSet: false,
        }
    },

    computed: {

        // The label text of the input, based upon the property 'name' or the property 'langKey', if it is set.
        label: function () {
            let langKey = this.name;
            if (this.langKey) {
                langKey = this.langKey + '.' + this.name;
            }
            langKey = 'input.' + langKey;
            let label = this.$t(langKey);

            if (label === langKey) {
                label = titleCase(this.name);
            }

            if (this.required) {
                label += ' *';
            }
            return label;
        },

        // The text to show to the user, if the check function exists and returns false.
        errorMessage: function () {
            return this.getLocalizationString(this.name);
        },

        // The text to show to the user, if the input is required and the user did not enter a value.
        requiredMessage: function () {
            return this.getLocalizationString('required', {'attribute': this.name});
        },

        // The name of the input. Will also be the name of the value, when the form gets submitted.
        // Info: This value is based upon the 'name' property.
        submitName: function () {
            return this.name;
        },

        // States if the content has changed since the page load
        contentChanged: function () {
            return this.submitValue !== this.value;
        },

        // The element that activates the help tooltip on hover
        tooltipActivator: function () {
            return this.$refs.inputWrapper;
        }
    },

    mounted: function () {
        this.$nextTick(function () {
            this.submitValue = this.value;

            let parents = getListOfParents(this);
            for (let index in parents) {
                let parent = parents[index];
                if (parent.hasOwnProperty("form")) {
                    this.parentForm = parent;
                    break;
                }
            }

            if (this.help) {
                new Tooltip(this.tooltipActivator, {
                    placement: this.helpPosition,
                    title: this.help
                });
            }

        })
    },

    watch: {
        submitValue: function (val) {

            // Convert booleans to integer
            if (typeof(val) === "boolean") {
                this.submitValue = val ? 1 : 0;
                return;
            }

            window.eventHub.$emit(this.name + '-input-changed', val);
            this.$emit('input', val);

            if (this.parentForm) {
                // set to null if empty string
                if (val === '') {
                    delete this.parentForm.form[this.submitName];
                } else {
                    this.parentForm.form[this.submitName] = val;
                }
            }

            // Only check input if the input wasn't cleared
            if (val || this.active) {
                this.checkInput();
                this.validateParentForm();
            }

            if (this.submitFormAfterSubmitValueIsSet) {
                this.submit();
            }
        },

        value: function (val) {
            this.submitValue = val;
        },

        labelMessage: function (message, oldMessage) {
            if (message !== oldMessage && this.currentPopover) {
                this.currentPopover.destroy();
                this.currentPopover = null;
            }

            if (message && this.popover && this.$refs.inputWrapper) {
                let popover = $('<div class="popover" role="tooltip"><div class="arrow" x-arrow></div><div class="popover-body">' + message + '</div></div>');
                $(this.$refs.inputWrapper).append(popover);
                this.currentPopover = new Popper(this.$refs.inputWrapper, popover[0], {
                    placement: this.popoverPosition,
                    removeOnDestroy: true,
                    modifiers: {
                        flip: {behavior: ['bottom']}
                    }
                });
            }
        }
    },

    methods: {

        /**
         * Activates the inputs editing style.
         */
        activate: function () {
            $(this.$refs.inputWrapper).addClass('active');
            this.active = true;
        },

        /**
         * Deactivates the inputs editing style.
         */
        deactivate: function () {
            $(this.$refs.inputWrapper).removeClass('active');
            this.active = false;
        },

        /**
         * Checks if the current value of the input is valid and
         * updates the input's label, based on the input's value.
         */
        checkInput: function () {
            if (this.checkRequired()
                && this.checkComponentSpecific()) {
                if (isFunction(this.check)) {
                    this.check(this.submitValue, (valid, errorMessage) => {
                        if (valid) {
                            this.addSuccess();
                        } else {
                            this.addError(errorMessage);
                        }
                    });
                } else {
                    this.addSuccess();
                }
            }
        },

        validateParentForm: function () {
            if (this.parentForm && isFunction(this.parentForm.updateFormSubmitPermission)) {
                this.parentForm.updateFormSubmitPermission();
            }
        },

        /**
         * Checks if the input's value is valid regarding the property 'required'.
         * If not an error message will be shown on the input.
         *
         * @returns {boolean}
         */
        checkRequired: function () {
            if (!this.submitValue && this.required) {
                this.addError(this.requiredMessage, true);

                return false;
            }
            return true;
        },

        /**
         * Checks if the input's value is valid regarding the specific needs in an input component.
         *
         * @returns {boolean}
         */
        checkComponentSpecific: function () {
            return true;
        },

        /**
         * Adds the specified error message to the input field.
         *
         * @param errorMessage
         * @param forceError
         */
        addError: function (errorMessage = this.errorMessage, forceError = false) {
            if (forceError || !this.ignoreErrors) {
                this.labelMessage = errorMessage;
                this.invalid = true;
                this.valid = false;
            }
        },

        /**
         * Shows a success sign on the input field.
         */
        addSuccess: function () {
            this.labelMessage = null;
            this.invalid = false;
            this.valid = true;
        },

        /**
         * Opens the help page for the input.
         */
        openHelp: function () {
            if (this.helpPath) {
                window.open(this.helpPath, '_blank');
            }
        },

        /**
         * Resets the input's value.
         */
        reset: function () {
            this.submitValue = this.value;
            this.labelMessage = null;
            this.invalid = false;
            this.valid = !this.required || this.value;
        },

        /**
         * Clears the input's value.
         */
        clear: function () {
            this.submitValue = '';
            this.labelMessage = null;
            this.invalid = false;
            this.valid = !this.required;
        },

        /**
         * Submits the parent form.
         */
        submit: function () {
            if (this.parentForm) {
                this.parentForm.submit();
            } else {
                $(this.$el).parents('form').eq(0).find('[type="submit"]').click();
            }
            this.submitFormAfterSubmitValueIsSet = false;
        },

        /**
         * Clears and submits the parent form.
         */
        clearSubmit: function () {
            this.submitFormAfterSubmitValueIsSet = true;
            this.clear();
        },

        /**
         * Gets the localization string for the error messages.
         *
         * @param type
         * @param props
         * @param plain
         * @returns {string}
         */
        getLocalizationString: function (type = null, props = null, plain = false) {
            let langKey = '';
            if (this.langKey && !plain) {
                langKey = this.langKey + '.';
            }

            let key = 'validation.' + langKey;
            let defaultKey = key;
            if (type) {
                key = 'validation.' + langKey + type;
                defaultKey = 'validation.' + type;
            }

            // Validate props
            if (props !== null && props.hasOwnProperty('attribute')) {
                let attribute = props.attribute;
                let attributeLangKey = 'validation.attributes.' + attribute;
                let attributeReplacement = this.$t(attributeLangKey);
                props.attribute = attributeReplacement === attributeLangKey ? attribute : attributeReplacement;
            }

            let text = this.$t(key, props);
            if (text === key) {
                text = this.$t(defaultKey, props);
            }

            return text;
        },
    }
};

