<template>
    <div class="form-group" ref="inputWrapper" :class="{ 'is-invalid': invalid && !valid, 'is-valid': valid && contentChanged }">

        <label :for="name + '-input'" v-if="showLabel" ref="inputLabel">
            <span>{{ label }}</span>
        </label>

        <div class="input-group" :class="[ color ? 'input-group-' + color : '', size ? 'input-group-' + size : '']">
            <span v-if="icon" class="input-group-addon">
                <icon :icon="icon"></icon>
            </span>

            <select :id="name + '-input'" :name="name" v-model="submitValue" class="form-control"
                    :aria-label="placeholder"
                   :disabled="disabled" ref="input" @focus="activate" @blur="deactivate">
                <option v-if="showPlaceholder" value="" disabled selected>{{ placeholder }}</option>
                <slot></slot>
                <option v-for="option in options" :value="option.value">{{ option.label }}</option>
            </select>

            <span class="input-group-addon has-tooltip" v-if="help" ref="helpIcon">
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

            /**
             * An array of strings or objects to be used as dropdown choices.
             * If you are using an array of objects, vue-select will look for
             * a `label` key (ex. [{label: 'This is Foo', value: 'foo'}]). A
             * custom label key can be set with the `label` prop.
             * @type {Array}
             */
            options: {
                type: Array,
                default() { return [] },
            },
        },
    }
</script>
