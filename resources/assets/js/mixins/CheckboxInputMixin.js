import formInputMixin from "./FormInputMixin";

export default {

    mixins: [formInputMixin],

    props: {
        // The predefined value of the checkbox. Overrides the mixin's prop.
        value: {
            type: Boolean|Number|String,
            default: false
        }
    },

    computed: {

        // The element that activates the help tooltip on hover
        tooltipActivator: function () {
            return null;
        }
    },

    methods: {

        /**
         * Toggles the submit value.
         */
        toggleValue: function () {
            if (_.isBoolean(this.value)) {
                this.submitValue = !this.submitValue;
            } else {
                if (this.submitValue) {
                    this.submitValue = false;
                } else {
                    this.submitValue = this.value;
                }
            }
        },
    }

};

