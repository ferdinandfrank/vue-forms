import formInputMixin from "./FormInputMixin";

export default {

    mixins: [formInputMixin],

    props: {

        // The predefined value of the checkbox that gets submitted when the checkbox is checked. Overrides the mixin's prop.
        value: {
            type: Boolean|Number|String,
            default: 1
        },

        // States if the checkbox is initially checked. If checked this input will submit the component's `value` prop,
        // otherwise `false` will be submitted.
        checked: {
            type: Boolean,
            default: false
        }
    },

    data() {
        return {

            // The real value that gets submitted.
            submitValue: this.checked ? this.value : false,

            // States if the checkbox is currently checked. If checked this input will submit the component's `value` prop,
            // otherwise `false` will be submitted.
            isChecked: this.checked
        }
    },

    computed: {

        // The element that activates the help tooltip on hover
        tooltipActivator: function () {
            return null;
        }
    },

    watch: {
        isChecked: function (checked) {
            if (checked) {
                this.submitValue = this.value;
            } else {
                this.submitValue = false;
            }
        }
    },

    methods: {

        /**
         * Toggles the submit value.
         */
        toggleValue: function () {
            this.isChecked = !this.isChecked;
        },
    }

};

