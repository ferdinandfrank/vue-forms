<template>
    <input :id="name + '-input'" type="hidden" :name="name" v-model="submitValue" :disabled="disabled" ref="input">
</template>

<script>
    import formInputMixin from '../../mixins/FormInputMixin';

    export default {
        mixins: [formInputMixin]
    }
</script>
