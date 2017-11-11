import Tooltip from 'tooltip.js';
import Validation from '../helpers/Validation';

export default {

    props: {

        // The name of the input. Will also be the key of the value when the form gets submitted.
        name: {
            type: String,
            required: true
        },

        // The predefined value of the input.
        // See data: 'submitValue'
        value: {
            type: String | Number,
            default: ''
        },

        // Array of rule objects to validate the input's value.
        // Each rule object must have one of the following value-key-pairs which define a rule:
        // - 'min': [Number: min length of input's value]
        // - 'max': [Number: max length of input's value]
        // - 'required': true
        // - 'confirmed': [String: name of the input field that should contain the same value as this input field]
        // - 'email': true
        //
        // Additionally a rule object can have a 'message' key with a corresponding error message as the value,
        // which will be shown when the given rule check fails.
        rules: {
            type: Array,
            default: () => {
                return []
            }
        },

        // The text to show above the input as a label. If not specified, no label will be shown.
        label: {
            type: String,
            default: null
        },

        // States if the input shall be disabled.
        disabled: {
            type: Boolean,
            default: false
        },

        // The help text to show as a tooltip when hovering over the input's help icon
        help: null,

        // The specific color of the input group
        color: null,

        // The specific size of the input group
        size: null,

    },

    data: function () {
        return {

            // The real value that gets submitted.
            submitValue: '',

            // States if the input's value is valid.
            valid: true,

            // The parent form component of the component.
            parentForm: '',

            // States if the input is currently focused.
            active: false,

            // States if the parent form shall be submitted when the submit value is synced on all other components.
            submitFormAfterSubmitValueIsSet: false,

            // States if the content has changed since the page load
            contentChanged: false,

            // The current error message to show.
            errorMessage: null,

            // The validation instance
            validation: null
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

            this.validation = new Validation(this.parentForm);

            // Init validation
            for (let i = 0; i < this.rules.length; i++) {
                let rule = this.rules[i];
                let ruleKey = Object.keys(rule)[0];
                let value = rule[ruleKey];
                let message = rule.hasOwnProperty('message') ? rule.message : null;
                let trigger = rule.hasOwnProperty('trigger') ? rule.trigger : 'input';

                $(this.$refs.input).on(trigger, () => {
                    this.validate(ruleKey, value, message);
                    this.validateParentForm();
                });
            }
        })
    },

    watch: {
        submitValue: function (val, oldValue) {

            if (oldValue) {
                this.contentChanged = true;
            }

            window.eventHub.$emit(this.name + '-input-changed', val, oldValue);
            this.$emit('input', val);

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
            this.active = true;
        },

        /**
         * Deactivates the inputs editing style.
         */
        deactivate: function () {
            this.active = false;
        },

        /**
         * Validates the current value against the input rules or only against the specified rule.
         */
        validate: function (rule, value = null, message = null) {
            return new Promise((resolve, reject) => {
                if (rule) {
                    this.validation.check(this.name, rule, this.submitValue, value).then((result) => {
                        let error = null;
                        if (!result.valid) {
                            error = message ? message : result.message;
                            this.addError(error);
                        } else {
                            this.addSuccess();
                        }

                        resolve({valid: !!error, message: error});
                    });
                } else {
                    reject('No rule specified.');
                }
            });
        },

        validateParentForm: function () {
            if (this.parentForm && _.isFunction(this.parentForm.validate)) {
                this.parentForm.validate();
            }
        },

        /**
         * Adds the specified error message to the input field.
         *
         * @param errorMessage
         */
        addError: function (errorMessage) {
            this.errorMessage = errorMessage;
            this.valid = false;
        },

        /**
         * Shows a success sign on the input field.
         */
        addSuccess: function () {
            this.errorMessage = null;
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
        }
    }
};

