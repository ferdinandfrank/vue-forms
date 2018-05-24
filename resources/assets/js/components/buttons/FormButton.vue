<template>
    <button type="button" class="btn" :class="[size ? 'btn-' + size : '', color ? 'btn-' + color : '']" @click="submit">
        <slot></slot>
    </button>
</template>

<script>

    import ajaxFormMixin from '../../mixins/AjaxFormMixin';

    export default {

        mixins: [ajaxFormMixin],

        props: {

            // The color class of the button.
            color: {
                type: String,
                default: 'danger'
            },

            // The size class of the button.
            size: {
                type: String
            },

            // The method to use for the submit. Overrides the mixin's prop.
            method: {
                type: String,
                default: 'delete'
            },
        },

        mounted() {
            this.$nextTick(function () {
                this.button = $(this.$el);
            });
        },

        methods: {

            /**
             * Will be called if the form has been successfully submitted.
             */
            onSuccess: function () {
                this.removeElement();
            }
        }
    }
</script>