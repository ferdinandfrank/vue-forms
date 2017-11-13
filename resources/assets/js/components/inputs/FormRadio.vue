<template>
    <div class="form-group" ref="inputWrapper"
         :class="{ 'is-invalid': !valid && contentChanged, 'is-valid': valid && contentChanged, 'active': active }">

        <div class="form-check" v-for="(label, key) in options">
            <label class="form-check-label">
                <input class="form-check-input" type="radio" :name="name" v-model="submitValue" v-bind:value="key">
                {{ label }}
            </label>
        </div>
        <slot></slot>
        <small v-if="help" class="form-text text-muted">
            {{ help }}
        </small>
        <div class="invalid-feedback" v-if="errorMessage">{{ errorMessage }}</div>

    </div>

</template>

<script>
    import formInputMixin from "../../mixins/FormInputMixin";

    export default {

        mixins: [formInputMixin],

        props: {

            /**
             * An object with keys as the value and values as the labels to be used as radio choices.
             */
            options: {
                type: Object,
                default() { return {} },
            },
        },

        computed: {

            // The element that activates the help tooltip on hover
            tooltipActivator: function () {
                return null;
            }
        },
    }

</script>
