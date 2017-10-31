import Tooltip from 'tooltip.js';

export default {

    // Internationalization module
    i18n,

    props: {

        // The name of the input. Will also be the key of the value when the form gets submitted.
        name: {
            type: String,
            required: true
        },

        // The predefined value of the input.
        // See data: 'submitValue'
        value: {
            type: String|Number,
            default: ''
        },

        // The language key of the label.
        // Will be inserted in a full key.
        // For the label to show on an input with the name 'email' the following key will be used:
        // 'input[.langKey].email'
        langKey: {
            type: String
        },

        // States if the input shall be disabled.
        disabled: {
            type: Boolean,
            default: false
        },

        // States if a label shall be displayed above the input.
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

        // States if a value on the input is required
        required: {
            type: Boolean,
            default: false
        },

        // The help text to show as a tooltip when hovering over the input's help icon
        help: null,

        // The position of the tooltip when the 'help' prop is set
        helpPosition: {
            type: String,
            default: 'top'
        },

        // The specific color of the input group
        color: null,

        // The specific size of the input group
        size: null,

        // States if errors on the input shall be ignored, i.e., shall not be displayed
        ignoreErrors: {
            type: Boolean,
            default: false
        }
    },

    data: function () {
        return {

            // The real value that gets submitted.
            submitValue: '',

            // The error message of the input to show.
            errorMessage: null,

            // States if the input's value is valid.
            valid: !this.required || this.value,

            // States if the input's value is invalid.
            invalid: false,

            // The parent form components of the component.
            parentForm: '',

            // States if the input is currently focused.
            active: false,

            // States if the parent form shall be submitted when the submit value is synced on all other components.
            submitFormAfterSubmitValueIsSet: false,

            // States if the content has changed since the page load
            contentChanged: false,
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

            // If no predefined label is set for the specified 'langKey', use the name of the input
            if (label === langKey) {
                label = _.startCase(this.name);
            }

            if (this.required) {
                label += ' *';
            }
            return label;
        },

        // The name of the input. Will also be the name of the value, when the form gets submitted.
        // Info: This value is based upon the 'name' property.
        submitName: function () {
            return this.name;
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
                if (_.isFunction(parent.validate)) {
                    this.parentForm = parent;
                    break;
                }
            }

            if (this.help && this.tooltipActivator) {
                new Tooltip(this.tooltipActivator, {
                    placement: this.helpPosition,
                    title: this.help
                });
            }

        })
    },

    watch: {
        submitValue: function (val, oldValue) {

            if (oldValue) {
                this.contentChanged = true;
            }

            // Convert booleans to integer for better Laravel validation
            if (typeof(val) === "boolean") {
                this.submitValue = val ? 1 : 0;
                return;
            }

            // Set to null if empty string
            if (val === '') {
                val = null;
            }

            window.eventHub.$emit(this.name + '-input-changed', val, oldValue);
            this.$emit('input', val);

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
                if (_.isFunction(this.check)) {
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
            if (this.parentForm && _.isFunction(this.parentForm.validate)) {
                this.parentForm.validate();
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
                this.addError(this.getLocalizationString('required', {'attribute': this.name}), true);

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
                this.errorMessage = errorMessage;
                this.invalid = true;
                this.valid = false;
            }
        },

        /**
         * Shows a success sign on the input field.
         */
        addSuccess: function () {
            this.errorMessage = null;
            this.invalid = false;
            this.valid = true;
        },

        /**
         * Resets the input's value.
         */
        reset: function () {
            this.submitValue = this.value;
            this.errorMessage = null;
            this.invalid = false;
            this.valid = !this.required || this.value;
        },

        /**
         * Clears the input's value.
         */
        clear: function () {
            this.submitValue = '';
            this.errorMessage = null;
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

