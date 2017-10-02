import formInputMixin from "./FormInputMixin";

export default {

    mixins: [formInputMixin],

    props: {
        // The predefined value of the checkbox.
        value: {
            type: Boolean,
            default: false
        },
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

