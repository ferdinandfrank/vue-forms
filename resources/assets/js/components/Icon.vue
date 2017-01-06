<template>
    <i :class="icon"><slot></slot></i>
</template>

<script>
    export default{
        props: {
            // The icon key
            icon: {
                type: String,
                required: true
            }
        }
    }

</script>
