export default {


    data() {
        return {

            // States, if the form can be submitted.
            valid: true,

            // The input fields of the form
            inputs: [],
        }
    },

    watch: {

        /**
         * Watch the validation state of the form.
         *
         * @param isValid {@code true} if the inner form is valid, {@code false} otherwise.
         */
        valid: function (isValid) {
            this.$emit('validated', isValid);
        },
    },

    mounted() {
        this.$nextTick(function () {

            // Disable the submit permission to let the user make at least one change
            this.validate();
        });
    },

    methods: {

        /**
         * Registers the specified input component as an input component of the form. Will be called by the
         * child input components themselves.
         *
         * @param inputComponent
         */
        registerChildInputComponent: function (inputComponent) {

            // Check if component is already registered
            if (_.findIndex(this.inputs, ['_uid', inputComponent._uid]) === -1) {
                this.inputs.push(inputComponent);

                // Trigger an event that at least on form input was changed
                inputComponent.$on('input', (value) => {
                   this.$emit('change', inputComponent.name, value);
                });
            }
        },

        /**
         * Removes the specified input component as an input component from the form. Will be called by the
         * child input components themselves.
         *
         * @param inputComponent
         */
        removeChildInputComponent: function (inputComponent) {

            // Check if component is registered
            if (_.findIndex(this.inputs, ['_uid', inputComponent._uid]) > -1) {
                this.inputs.splice(this.inputs.indexOf(inputComponent), 1);
            }
        },

        /**
         * Updates the state of the submit button and checks if the form can be submitted,
         * depending if the child inputs allow a submit.
         */
        validate: function () {
            let allInputsValid = true;
            _.each(this.inputs, input => {
                if (input.hasOwnProperty("valid") && !input.valid) {
                    allInputsValid = false;
                }
            });

            this.valid = allInputsValid;
        },
    }
};

