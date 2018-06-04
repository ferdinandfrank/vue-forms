import formInputMixin from "./FormInputMixin";

export default {

    mixins: [formInputMixin],

    props: {

        // The predefined value of the input. Overrides the mixin's prop.
        // See data: 'submitValue'
        value: {
            type: String | Number | Boolean,
            default: 0
        },

        // The value to submit when the checkbox is checked
        checkedValue: {
            type: String | Number | Boolean,
            default: 1
        }
    },

    data() {
        return {

            // States if the checkbox is currently checked. If checked this input will submit the component's `checkedValue` prop,
            // otherwise 0 will be submitted.
            isChecked: !!this.value
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
                this.submitValue = this.checkedValue;
            } else {
                this.submitValue = 0;
            }
        }
    },

    mounted() {
        this.$nextTick(function () {
            if (this.value) {
                this.submitValue = this.checkedValue;
            } else {
                this.submitValue = 0;
            }
        });
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

