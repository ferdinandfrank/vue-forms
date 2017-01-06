<template>
    <button type="button" :class="'btn-' + size + ' btn-' + color" @click="removeElement">
        <slot></slot>
    </button>
</template>

<script>

    import removeElementMixin from '../../mixins/RemoveElementMixin';

    export default{

        mixins: [removeElementMixin],

        props: {
            color: {
                type: String,
                default: 'error'
            },
            size: {
                type: String,
                default: 'small'
            }
        }
    }
</script>