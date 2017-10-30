import formInputMixin from "./FormInputMixin";

export default {
    mixins: [formInputMixin],

    props: {

        // The minimum length of the input value.
        min: {
            type: Number,
            default: null
        },

        // The maximum length of the input value.
        max: {
            type: Number,
            default: null
        },

        // If true, the input is treated as a confirmation input and needs to have a corresponding input with the same value.
        // Ex.: If the name of this input is 'foo_confirmation', the input with the name 'foo' must have the same value.
        confirmed: {
            type: Boolean,
            default: false
        },

        // The placeholder to shown on the input.
        placeholder: {
            type: String,
            default: null
        },

        // The icon to show next to the input field.
        icon: {
            type: String,
            default: null
        },

        // States, if a form submit button shall be appended on the input.
        // Additionally a reset button will be appended if the form was already submitted.
        addonSubmit: {
            type: Boolean,
            default: false
        },

        // The text to show in the appended submit button, see 'addonSubmit'
        addonSubmitContent: {
            type: String,
            default: 'Go!'
        },

        // The color of the appended submit button, see 'addonSubmit'
        addonSubmitColor: {
            type: String,
            default: null
        },

        // The color of the appended reset button, see 'addonSubmit'
        addonResetColor: {
            type: String,
            default: null
        },
    },

    data: function () {
        return {
            showAddonSubmit: this.addonSubmit || this.addonSubmitContent !== 'Go!'
        }
    },

    computed: {

        // States if the max length counter shall be shown on the input.
        showMaxLengthCounter: function () {
            return this.max && !this.showMinLengthCounter;
        },

        // States if the min length counter shall be shown on the input.
        showMinLengthCounter: function () {
            return this.min && this.submitValue.length < this.min;
        },

        // The element that activates the help tooltip on hover
        tooltipActivator: function() {
            return this.$refs.helpIcon;
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

        /**
         * Checks if the input's value is valid regarding the property 'maxLength'.
         * If not an error message will be shown on the input.
         *
         * @returns {boolean}
         */
        checkMaxLength: function () {
            if (this.max && this.submitValue.length > this.max) {
                this.addError(this.getLocalizationString('max.string', {max: this.max, 'attribute': this.name}));
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
            if (this.submitValue.length > 0 && this.min && this.submitValue.length < this.min) {
                this.addError(this.getLocalizationString('min.string', {min: this.min, 'attribute': this.name}));
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
                if (confirmInput.val() !== this.submitValue) {
                    this.addError(this.getLocalizationString('confirmed', {'attribute': confirmName}));
                    return false;
                }
            }
            return true;
        }
    }
};

