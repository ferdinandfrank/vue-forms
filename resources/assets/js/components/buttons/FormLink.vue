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
             * Will be called if the form has been successfully submitted.
             */
            onSuccess: function () {
                this.removeElement();
            }
        }
    }

</script>
