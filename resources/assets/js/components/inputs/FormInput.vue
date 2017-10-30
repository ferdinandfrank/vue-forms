<template>
    <div class="form-group" ref="inputWrapper"
         :class="{ 'is-invalid': invalid && !valid, 'is-valid': valid && contentChanged }">

        <label :for="name + '-input'" v-if="showLabel" ref="inputLabel">
            <span>{{ label }}</span>
        </label>

        <div class="input-group" :class="[ color ? 'input-group-' + color : '', size ? 'input-group-' + size : '']">
            <span v-if="icon" class="input-group-addon">
                <icon :icon="icon"></icon>
            </span>

            <input :id="name + '-input'" type="text" :name="name" v-model="submitValue" class="form-control"
                   :placeholder="placeholder ? placeholder : ''" :step="step" :aria-label="placeholder ? placeholder : ''"
                   :disabled="disabled" ref="input" @focus="activate" @blur="deactivate">

            <span class="input-group-addon has-tooltip" v-if="help" ref="helpIcon">
                <icon icon="fa fa-question"></icon>
            </span>

            <span class="input-group-btn" v-if="showAddonSubmit && submitValue">
                <button class="btn" :class="addonResetColor ? 'btn-' + addonResetColor : ''" type="button"
                        v-on:click="clearSubmit"><icon icon="fa fa-fw fa-times"></icon></button>
            </span>

            <span class="input-group-btn" v-if="showAddonSubmit">
                <button class="btn" :class="addonSubmitColor ? 'btn-' + addonSubmitColor : ''"
                        :id="'btn-submit-' + name + '-input'" type="submit">{{ addonSubmitContent }}</button>
            </span>
        </div>

        <div class="invalid-feedback" v-if="errorMessage">{{ errorMessage }}</div>

        <span v-if="showMaxLengthCounter" class="counter">{{ submitValue.length }} / {{ max }}</span>
        <span v-if="showMinLengthCounter" class="counter">{{ submitValue.length }} / {{ min }}</span>
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
            step: {
                type: String,
                default: ''
            }
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
