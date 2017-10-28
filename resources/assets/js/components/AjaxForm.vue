<template>
    <form :action="action" :method="method" @submit="submit">
        <slot></slot>
    </form>
</template>

<script>
    import extendedAjaxFormMixin from '../mixins/ExtendedAjaxFormMixin';

    export default {
        mixins: [extendedAjaxFormMixin]
    }

</script>
