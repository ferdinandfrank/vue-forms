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
            type: String | Number | Boolean,
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

            // The editable 'value' prop that gets submitted.
            submitValue: this.value,

            // A value copy of the initially specified input value to reset the input
            initialValue: this.value,

            // States if the input's value is valid.
            valid: true,

            // The parent form component of the component.
            parentForm: '',

            // States if the input is currently focused.
            active: false,

            // States if the parent form shall be submitted when the submit value is synced on all other components.
            submitFormAfterSubmitValueIsSet: false,

            // States if the input has currently been cleared and if the errors shall be ignored on the next validation
            ignoreValidationDueToClear: false,

            // States if the content has changed since the page load.
            contentChanged: false,

            // The current errors due to the validation.
            errors: {},

            // The current error message to show.
            errorMessage: null,

            // The validation instance for the input.
            validation: null,

            // States if a value is required. Will be fetched from the defined validation rules.
            required: false,

            // The current timeout instances for each validation rule to wait before we validate an input
            validationTimeouts: []
        }
    },

    mounted: function () {
        this.$nextTick(function () {

            if (this.$parent._isMounted) {
                this.registerOnFormComponent();
            }

            this.validation = new Validation(this.parentForm.$el);

            // Set required state for the input label if a required rule is specified
            this.required  = !!_.find(this.rules, function(rule) { return rule.required || rule.required_with || rule.required_if; });

            // Validate against all rules once to disable the parent's form submit, but do not show the error to the user
            this.validate().then((result) => {
                this.ignoreErrors();
            });
        })
    },

    beforeDestroy() {
        if (this.parentForm) {
            this.parentForm.removeChildInputComponent(this);
        }
    },

    watch: {
        submitValue: function (val, oldValue) {

            // We only trigger a submit value change, if the value really changed,
            // i.e., a change from 'null' to 'undefined' or '' is not a real change
            let emptyValues = [undefined, null, ''];
            if (emptyValues.indexOf(val) > -1 && emptyValues.indexOf(oldValue) > -1) {
                return;
            }

            this.contentChanged = true;

            // Set server errors to true, because we can not validate if the server errors are gone
            this.addSuccess('server');

            this.validate().then(() => {
                window.eventHub.$emit(this.name + '-input-changed', val, oldValue);
                this.$emit('input', val);

                // Visually hide the input's errors if a reset or a clear was executed. Will also be hidden when the
                // initial input value is set again
                if (this.ignoreValidationDueToClear || val === this.initialValue) {
                    this.ignoreErrors();
                    this.ignoreValidationDueToClear = false;
                }

                if (this.submitFormAfterSubmitValueIsSet) {
                    setTimeout(() => {
                        this.submit();
                    }, 1000);
                }
            });
        },

        value: function (val) {
            this.submitValue = val;
        },

        valid: function (valid, oldValid) {
            if (valid !== oldValid) {
                window.eventHub.$emit(this.name + '-input-validated', valid);
            }
        },
    },

    methods: {

        /**
         * Registers the component as input component on its parent form component.
         */
        registerOnFormComponent: function () {
            let parents = getListOfParents(this);
            for (let i = 0; i < parents.length; i++) {
                if (_.isFunction(parents[i].registerChildInputComponent)) {
                    this.parentForm = parents[i];
                    parents[i].registerChildInputComponent(this);
                    break;
                }
            }
        },

        /**
         * Activates the inputs editing style.
         */
        activate: function () {
            this.active = true;
            this.$emit('focus');
        },

        /**
         * Deactivates the inputs editing style.
         */
        deactivate: function () {
            this.active = false;
            this.$emit('blur');
        },

        /**
         * Validates the current value against the input rules or only against the specified rule.
         */
        validate: function (rule = null, value = null, message = null, timeout = VUE_FORMS_VALIDATION_TIMEOUT) {

            if (!rule) {
                return new Promise((resolve) => {
                    let validations = [];
                    for (let i = 0; i < this.rules.length; i++) {
                        let rule = this.rules[i];
                        let ruleKey = Object.keys(rule)[0];
                        let value = rule[ruleKey];
                        let message = rule.hasOwnProperty('message') ? rule.message : null;
                        let timeout = rule.hasOwnProperty('timeout') ? rule.timeout : VUE_FORMS_VALIDATION_TIMEOUT;

                        validations.push(this.validate(ruleKey, value, message, timeout));
                    }

                    Promise.all(validations).then(results => {
                        let valid = true;
                        let errors = [];
                        _.each(results, result => {
                            if (!result.valid) {
                                valid = false;
                                errors.push(result.message);
                            }
                        });
                        this.validateParentForm();
                        resolve({valid: valid, message: errors});
                    });
                });
            }

            // Set a timeout to not validate on every consecutive change for that rule
            if (this.validationTimeouts[rule]) {
                clearTimeout(this.validationTimeouts[rule]);
            }

            return new Promise((resolve) => {
                this.validationTimeouts[rule] = setTimeout(() => {
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
                }, timeout);
            });

        },

        /**
         * Validates all inputs of the parent form.
         */
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
            this.ignoreValidationDueToClear = true;
            this.submitValue = this.initialValue;
        },

        /**
         * Clears the input's value.
         */
        clear: function () {
            this.ignoreValidationDueToClear = true;
            this.submitValue = '';
        },

        /**
         * Hides the errors on the input. Important: the errors still exist, but are not visible to the user.
         */
        ignoreErrors: function () {
            this.errorMessage = null;
            this.contentChanged = false;
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
         * Clears the input's value and submits the parent form.
         */
        clearSubmit: function () {
            this.submitFormAfterSubmitValueIsSet = true;
            this.clear();
        }
    }
};

