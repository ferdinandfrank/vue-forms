<template>
    <a :href="action" @click="submit">
        <slot></slot>
    </a>
</template>

<script>
    import ajaxFormMixin from '../../mixins/AjaxFormMixin';

    export default {

        mixins: [ajaxFormMixin],

        methods: {

            /**
             * Will be called if the form has been successfully submitted.
             */
            onSuccess: function () {
                this.removeElement();
            }
        },

        mounted() {
            this.$nextTick(function () {
                this.button = $(this.$el);
            });
        },
    }

</script>
