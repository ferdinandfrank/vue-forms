import formInputMixin from "./FormInputMixin";

module.exports = {
    mixins: [formInputMixin],

    props: {

        // The minimum length of the input value.
        minLength: {
            type: Number
        },

        // The maximum length of the input value.
        maxLength: {
            type: Number
        },

        // If true, the input is treated as a confirmation input and needs to have a corresponding input with the same value.
        // Ex.: If the name of this input is 'foo_confirmation', the input with the name 'foo' must have the same value.
        confirmed: {
            type: Boolean
        },

        // States if a placeholder shall be shown on the input.
        showPlaceholder: {
            type: Boolean,
            default: false
        },

        // The icon to show next to the input field.
        icon: {
            type: String
        },

        // States, if a click on the input's icon shall submit the parents form.
        addonSubmit: {
            type: Boolean
        },
    },

    computed: {

        // The placeholder text of the input, based upon the property 'name' or the property 'langKey', if it is set.
        placeholder: function () {
            let langKey = this.name;
            if (this.langKey) {
                langKey = this.langKey + '.' + this.name;
            }
            return this.$t('placeholder.' + langKey);
        },

        // The text to show to the user, if the value of the input is to short.
        minLengthMessage: function () {
            return this.getLocalizationString('min.string', {min: this.minLength, 'attribute': this.name});
        },

        // The text to show to the user, if the value of the input is to long.
        maxLengthMessage: function () {
            return this.getLocalizationString('max.string', {max: this.maxLength, 'attribute': this.name});
        },

        // The text to show to the user, if the confirmation input does not have the same value as this input.
        confirmedMessage: function () {
            return this.getLocalizationString('confirmed');
        }
    },

    methods: {

        /**
         * Checks if the current value of the input is valid and
         * updates the input's label, based on the input's value.
         */
        checkInput: function () {
            if (this.checkRequired()
                && this.checkComponentSpecific()
                && this.checkMinLength()
                && this.checkMaxLength()
                && this.checkConfirmed()) {
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

        /**
         * Checks if the input's value is valid regarding the property 'maxLength'.
         * If not an error message will be shown on the input.
         *
         * @returns {boolean}
         */
        checkMaxLength: function () {
            if (this.maxLength && this.submitValue.length > this.maxLength) {
                this.addError(this.maxLengthMessage);
                return false;
            }
            return true;
        },

        /**
         * Checks if the input's value is valid regarding the property 'minLength'.
         * If not an error message will be shown on the input.
         *
         * @returns {boolean}
         */
        checkMinLength: function () {
            if (this.minLength && this.submitValue.length < this.minLength) {
                this.addError(this.minLengthMessage);
                return false;
            }
            return true;
        },

        /**
         * Checks if the input's value is valid regarding the property 'confirmed'.
         * If not an error message will be shown on the input.
         *
         * @returns {boolean}
         */
        checkConfirmed: function () {
            if (this.confirmed) {
                let confirmNameLength = this.name.length - '_confirmation'.length;
                let confirmName = this.name.substring(0, confirmNameLength);
                let confirmInput = $(this.$refs.input).parents('form').first().find(':input[name=' + confirmName + ']').first();
                if (confirmInput.val() != this.submitValue) {
                    this.addError(this.confirmedMessage);
                    return false;
                }
            }
            return true;
        }
    }
};

