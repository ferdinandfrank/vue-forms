module.exports = {

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

        // The path of the page to send the user if he clicks the help icon on the input.
        // No icon will be shown if this property isn't set.
        helpPath: {
            type: String
        }
    },

    data: function () {
        return {

            // States if a help icon shall be displayed next to the input.
            showHelp: this.helpPath ? true : false,

            submitValue: '',

            labelMessage: '',

            // States if the input's value is valid.
            valid: !this.required || this.value,

            // States if the input's value is invalid.
            invalid: false,

            // The parent components of the component.
            parents: ''
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
        }
    },

    mounted: function () {
        this.$nextTick(function () {
            this.submitValue = this.value;
            this.parents = getListOfParents(this);
        })
    },

    watch: {
        submitValue: function (val) {
            for (let index in this.parents) {
                let parent = this.parents[index];
                if (parent.hasOwnProperty("form")) {
                    parent.form[this.submitName] = val;
                }
            }

            window.eventHub.$emit(this.name + '-input-changed', val);
            this.checkInput();
            this.validateParentForm();
        },

        value: function (val) {
            this.submitValue = val;
        }
    },

    methods: {

        /**
         * Activates the inputs editing style.
         */
        activate: function () {
            $(this.$refs.inputWrapper).addClass('active');
        },

        /**
         * Deactivates the inputs editing style.
         */
        deactivate: function () {
            $(this.$refs.inputWrapper).removeClass('active');
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
            for (let index in this.parents) {
                let parent = this.parents[index];
                if (isFunction(parent.updateFormSubmitPermission)) {
                    parent.updateFormSubmitPermission();
                }
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
                this.addError(this.requiredMessage);
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
         */
        addError: function (errorMessage = this.errorMessage) {
            this.labelMessage = errorMessage;
            this.invalid = true;
            this.valid = false;
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
            window.open(this.helpPath, '_blank');
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

            let text = this.$t(key, props);
            if (text == key) {
                text = this.$t(defaultKey, props);
            }

            return text;
        },
    }
};

