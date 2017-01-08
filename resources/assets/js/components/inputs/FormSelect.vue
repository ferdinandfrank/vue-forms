<template>
    <div class="form-group" ref="inputWrapper" :class="{ 'has-error': hasError, 'has-success': hasSuccess }">
        <select :id="name + '-input'"
                :name="submitName"
                @focus="activate"
                @blur="deactivate"
                :placeholder="showPlaceholder ? placeholder : ''"
                ref="input"
                :disabled="disabled"
                :multiple="multiple"
                class="form-control">
            <slot></slot>
        </select>

        <button type="submit" v-if="icon && addonSubmit" class="form-group-addon" :style="{cursor: valid ? 'pointer' : 'not-allowed'}">
            <icon :icon="icon"></icon>
        </button>
        <span v-if="icon && !addonSubmit" class="form-group-addon">
            <icon :icon="icon"></icon>
        </span>

        <label :for="name + '-input'" v-if="showLabel" ref="inputLabel" :data-message="labelMessage">
            <span>{{ label }}</span>
            <i v-if="showHelp" @click="openHelp" class="fa fa-fw fa-question help"></i>
        </label>
    </div>
</template>

<script>
    import formInputMixin from '../../mixins/TextFormInputMixin';
    export default{
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
                type: Array|String|Number
            }
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
                $(this.$refs.input).select2();

                this.submitValue = this.value;
                $(this.$refs.input).val(this.value);
                $(this.$refs.input).trigger('change');

                $(this.$refs.input).on("change", (event) => {
                    this.submitValue = $(this.$refs.input).val();
                });
            });
        },
    }
</script>
