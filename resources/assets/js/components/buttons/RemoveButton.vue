<template>
    <button type="button" class="btn" :class="'btn-' + size + ' btn-' + color" @click="removeElement">
        <slot></slot>
    </button>
</template>

<script>

    import removeElementMixin from '../../mixins/RemoveElementMixin';

    export default{

        mixins: [removeElementMixin],

        props: {

            // The color class of the button.
            color: {
                type: String,
                default: 'danger'
            },

            // The size class of the button.
            size: {
                type: String
            }
        }
    }
</script>