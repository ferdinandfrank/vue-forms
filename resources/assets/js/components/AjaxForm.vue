<template>
    <form :action="submitAction" :method="submitMethod" @submit.prevent="submit">
        <slot></slot>
    </form>
</template>

<script>
    import extendedAjaxFormMixin from '../mixins/ExtendedAjaxFormMixin';

    export default {
        mixins: [extendedAjaxFormMixin]
    }

</script>
