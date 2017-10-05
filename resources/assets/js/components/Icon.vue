<template>
    <i :class="icon" aria-hidden="true">
        <slot></slot>
    </i>
</template>

<script>
    export default {
        props: {

            // The icon class.
            icon: {
                type: String,
                required: true
            }
        }
    }

</script>
