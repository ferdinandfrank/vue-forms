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

            // The current errors due to the validation.
            errors: {},

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

            this.validation = new Validation(this.parentForm.$el);

            // Init validation
            for (let i = 0; i < this.rules.length; i++) {
                let rule = this.rules[i];
                let ruleKey = Object.keys(rule)[0];
                let value = rule[ruleKey];
                let message = rule.hasOwnProperty('message') ? rule.message : null;
                let trigger = rule.hasOwnProperty('trigger') ? rule.trigger : 'input';

                $(this.$refs.input).on(trigger, () => {
                    this.validate(ruleKey, value, message);
                });
            }
        })
    },

    watch: {
        submitValue: function (val, oldValue) {
            if (oldValue) {
                this.contentChanged = true;
            }

            // Set server errors to true, because we can not validate if the server errors are gone
            this.addSuccess('server');

            window.eventHub.$emit(this.name + '-input-changed', val, oldValue);
            this.$emit('input', val);

            if (this.submitFormAfterSubmitValueIsSet) {
                this.submit();
            }
        },

        value: function (val) {
            this.submitValue = val;
        },

        errors: {
            handler: function (errors) {
                this.valid = !errors.length;
            },
            deep: true
        }
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
        validate: function (rule = null, value = null, message = null) {
            if (!rule) {
                return new Promise((resolve) => {
                    let valid = true;
                    let messages = [];
                    for (let i = 0; i < this.rules.length; i++) {
                        let rule = this.rules[i];
                        let ruleKey = Object.keys(rule)[0];
                        let value = rule[ruleKey];
                        let message = rule.hasOwnProperty('message') ? rule.message : null;

                        this.validate(ruleKey, value, message).then((result) => {
                            if (!result.valid) {
                                valid = false;
                                messages.push(result.message);
                            }
                        });
                    }

                    resolve({valid: !!error, message: error});
                });
            }

            return new Promise((resolve) => {
                this.validation.check(this.name, rule, this.submitValue, value).then((result) => {
                    let error = null;
                    if (!result.valid) {
                        error = message ? message : result.message;
                        this.addError(rule, error);
                    } else {
                        this.addSuccess(rule);
                    }

                    this.validateParentForm();
                    resolve({valid: !!error, message: error});
                });
            });
        },

        validateParentForm: function () {
            if (this.parentForm && _.isFunction(this.parentForm.validate)) {
                this.parentForm.validate();
            }
        },

        /**
         * Adds an error for the specified rule to the input.
         *
         * @param rule
         * @param errorMessage
         */
        addError: function (rule, errorMessage) {
            this.errors[rule] = errorMessage;
            this.valid = false;
            this.errorMessage = errorMessage;
        },

        /**
         * Removes the error of the specified rule or adds a complete success state if no rule is specified.
         */
        addSuccess: function (rule = null) {
            if (rule) {
                delete this.errors[rule];
            } else {
                this.errors = {};
            }

            this.valid = !Object.keys(this.errors).length;
            this.errorMessage = Object.keys(this.errors).length ? this.errors[Object.keys(this.errors)[0]] : null;
        },

        /**
         * Resets the input's value.
         */
        reset: function () {
            this.submitValue = this.value;
            this.validate();
        },

        /**
         * Clears the input's value.
         */
        clear: function () {
            this.submitValue = '';
            this.validate();
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

