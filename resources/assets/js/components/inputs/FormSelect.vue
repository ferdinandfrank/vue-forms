<template>
    <div class="form-group" ref="inputWrapper" :class="{ 'is-invalid': !valid && contentChanged, 'is-valid': valid && contentChanged, 'active': active }">

        <label :for="name + '-input'" v-if="label" ref="inputLabel">
            <span>{{ label }}{{ required ? '*' : '' }}</span>
        </label>

        <div class="input-group" :class="[ color ? 'input-group-' + color : '', size ? 'input-group-' + size : '']">
            <span v-if="icon" class="input-group-addon">
                <icon :icon="icon"></icon>
            </span>

            <select :id="name + '-input'" :name="multiple ? (name + '[]') : name" v-model="submitValue" class="form-control"
                    :aria-label="placeholder" :multiple="multiple"
                    :disabled="disabled" ref="input" @focus="activate" @blur="deactivate">
                <option v-if="placeholder" value="" disabled selected>{{ placeholder }}</option>
                <slot></slot>
                <option v-for="option in options" :value="option.value">{{ option.text }}</option>
            </select>

            <span class="input-group-addon has-tooltip" v-if="help" ref="helpIcon">
                <icon icon="fa fa-question" :title="help" v-tooltip:left></icon>
            </span>

            <span class="input-group-btn" v-if="showAddonSubmit">
                 <slot name="appendbutton"></slot>
                <button v-if="!$slots.appendbutton" class="btn" :class="addonSubmitColor ? 'btn-' + addonSubmitColor : ''"
                        type="submit">{{ addonSubmitContent }}</button>
            </span>
        </div>

        <div class="invalid-feedback" v-if="errorMessage">{{ errorMessage }}</div>

    </div>

</template>

<script>
    import formInputMixin from '../../mixins/TextFormInputMixin';

    export default {
        mixins: [formInputMixin],

        props: {

            // The predefined value of the input.
            // See data: 'submitValue'
            value: {
                type: String | Number | Array,
                default: ''
            },

            /**
             * An array with objects containing a key 'value' with the option value and a key 'text' with the option text to show. These will be used as dropdown choices.
             */
            options: {
                type: Array,
                default: () => {
                    return []
                },
            },

            // States if multiple values can be selected on the input
            multiple: {
                type: Boolean,
                default: false
            }
        },
    }
</script>
