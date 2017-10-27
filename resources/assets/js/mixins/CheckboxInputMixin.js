import formInputMixin from "./FormInputMixin";

export default {

    mixins: [formInputMixin],

    props: {
        // The predefined value of the checkbox.
        value: {
            type: Boolean,
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
            this.submitValue = !this.submitValue;
        },
    }

};

