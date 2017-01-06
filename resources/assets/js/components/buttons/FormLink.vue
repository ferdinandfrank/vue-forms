<template>
    <a :href="action" @click.prevent="submit">
        <slot></slot>
    </a>
</template>

<script>
    import ajaxFormMixin from '../../mixins/AjaxFormMixin';
    import removeElementMixin from '../../mixins/RemoveElementMixin';

    export default {

        mixins: [ajaxFormMixin, removeElementMixin],

        methods: {

            /**
             * Will be called if the form was successfully submitted.
             *
             * @param response The response from the server.
             */
            onSuccess: function (response) {
                this.removeElement();
            }
        }
    }

</script>
