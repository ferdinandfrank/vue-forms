<template>
    <button type="button" class="btn" :class="[size ? 'btn-' + size : '', color ? 'btn-' + color : '']" @click="submit">
        <slot></slot>
    </button>
</template>

<script>

    import ajaxFormMixin from '../../mixins/AjaxFormMixin';
    import removeElementMixin from '../../mixins/RemoveElementMixin';

    export default {

        mixins: [ajaxFormMixin, removeElementMixin],

        props: {
            color: {
                type: String,
                default: 'error'
            },
            size: {
                type: String
            },
            // The method to use for the submit.
            // See computed property: 'submitMethod'
            method: {
                type: String,
                default: 'delete'
            },
        },

        computed: {

            // The submit button of the form. Used to show the loader as soon as the submit request is pending.
            button: function() {
                return $(this.$el);
            },
        },

        methods: {

            /**
             * Will be called if the form was successfully submitted.
             */
            onSuccess: function () {
                this.removeElement();
            }
        }
    }
</script>
#
