<template>
    <div class="form-group" ref="inputWrapper"
         :class="{ 'is-invalid': invalid && !valid, 'is-valid': valid && submitValue }">

        <label :for="name + '-input'" v-if="showLabel" ref="inputLabel">
            <span>{{ label }}</span>
        </label>

        <div class="input-group" :class="[ color ? 'input-group-' + color : '', size ? 'input-group-' + size : '']">
            <span v-if="icon" class="input-group-addon">
                <icon :icon="icon"></icon>
            </span>

            <input :id="name + '-input'" type="text" :name="name" v-model="submitValue" class="form-control"
                   :placeholder="showPlaceholder ? placeholder : ''" :step="step" :aria-label="placeholder"
                   :disabled="disabled" ref="input" @focus="activate" @blur="deactivate">

            <span class="input-group-btn" v-if="showAddonSubmit">
                <button class="btn" :class="addonSubmitColor ? 'btn-' + addonSubmitColor : ''"
                        type="submit">{{ addonSubmitContent }}</button>
            </span>
        </div>
        <small v-if="help" class="form-text text-muted">
            {{ help }}
        </small>
        <div v-if="invalid && !valid" class="invalid-feedback">
            {{ labelMessage }}
        </div>

    </div>
</template>

<script>
    import formInputMixin from '../../mixins/TextFormInputMixin';

    export default {
        mixins: [formInputMixin],
        props: {

            // The type of the input field.
            type: {
                type: String,
                default: 'text'
            },

            // The step to increase the value if the input's type is set to "number".
            step: '',

            // The specific color of the input group
            color: null,

            // The specific size of the input group
            size: null
        },

        mounted() {
            this.$nextTick(function () {

                // Necessary, because of setting the type directly is not possible with vue.
                $(this.$refs.input).attr('type', this.type);
            })
        },

        methods: {

            /**
             * Checks if the input's value is valid regarding the property 'type'.
             *
             * @returns {boolean}
             */
            checkComponentSpecific: function () {
                if (this.type === 'email' && !isValidEmail(this.submitValue)) {
                    this.addError(this.getLocalizationString('email', {'attribute': this.name}, true));
                    return false;
                }
                return true;
            }
        }
    }
</script>
