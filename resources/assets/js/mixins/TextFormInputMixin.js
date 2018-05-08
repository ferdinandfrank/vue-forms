import formInputMixin from "./FormInputMixin";

export default {
    mixins: [formInputMixin],

    props: {

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
            default: null
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
            showAddonSubmit: this.addonSubmit || this.addonSubmitContent || this.$slots.append || this.$slots.appendbutton,

            // The min length of the input's value. Will be retrieved from the rules.
            min: null,

            // The max length of the input's value. Will be retrieved from the rules.
            max: null
        }
    },

    computed: {

        // States if the max length counter shall be shown on the input.
        showMaxLengthCounter: function () {
            return this.max && !this.showMinLengthCounter;
        },

        // States if the min length counter shall be shown on the input.
        showMinLengthCounter: function () {
            return this.min && (!this.submitValue || this.submitValue.length < this.min)
        }
    },

    mounted: function () {
        this.$nextTick(function () {
            _.find(this.rules, (rule) => {
                let key = Object.keys(rule)[0];
                if (key === 'min') {
                    this.min = rule[key];
                }
                if (key === 'max') {
                    this.max = rule[key];
                }
            });
        })
    }
};

