<template>
    <div class="form-group" ref="inputWrapper"
         :class="{ 'is-invalid': hasError, 'is-valid': hasSuccess }">

        <label :for="name + '-input'" v-if="showLabel" ref="inputLabel">
            <span>{{ label }}</span>
        </label>

        <div class="input-group" :class="[ color ? 'input-group-' + color : '', size ? 'input-group-' + size : '']">
            <span v-if="icon" class="input-group-addon">
                <icon :icon="icon"></icon>
            </span>

            <select :id="name + '-input'" :name="submitName" @focus="activate" @blur="deactivate" ref="input"
                    :disabled="disabled" :multiple="multiple" class="form-control">
                <option value v-if="showPlaceholder">{{ placeholder }}</option>
                <slot></slot>
            </select>

            <span class="input-group-addon" v-if="help" ref="helpIcon">
                <icon icon="fa fa-question"></icon>
            </span>

            <span class="input-group-btn" v-if="showAddonSubmit">
                <button class="btn" :class="addonSubmitColor ? 'btn-' + addonSubmitColor : ''"
                        type="submit">{{ addonSubmitContent }}</button>
            </span>
        </div>
    </div>

</template>

<script>
    import formInputMixin from '../../mixins/TextFormInputMixin';

    export default {
        mixins: [formInputMixin],
        props: {
            // True, if multiple values can be selected.
            multiple: {
                type: Boolean,
                default: false
            },

            // The predefined value of the input.
            // See data: 'submitValue'
            value: {
                type: Array | String | Number
            },

            // States if a placeholder shall be shown on the input.
            showPlaceholder: {
                type: Boolean,
                default: true
            },
        },

        computed: {
            // The name of the input. Will also be the name of the value, when the form gets submitted.
            // Info: This value is based upon the 'name' property.
            submitName: function () {
                if (this.multiple) {
                    return this.name + '[]';
                }
                return this.name;
            },

            // States if a success layout shall be shown on the input.
            hasSuccess: function () {
                if (this.valid && this.submitValue) {
                    return typeof this.submitValue === 'string' || typeof this.submitValue === 'number' || this.submitValue.length > 0
                }
                return false;
            },

            // States if an error layout shall be shown on the input.
            hasError: function () {
                return this.invalid && !this.valid;
            }
        },

        mounted() {
            this.$nextTick(function () {
                let placeholder = this.showPlaceholder ? this.placeholder : null;
                let input = $(this.$refs.input);

                input.select2({
                    placeholder: placeholder,
                    multiple: this.multiple,
                    language: 'de'
                });

                if (this.value !== null) {
                    input.val(this.value);
                }

                this.submitValue = input.val();

                input.on("change", () => {
                    this.submitValue = input.val();
                });

            });
        },
    }
</script>
