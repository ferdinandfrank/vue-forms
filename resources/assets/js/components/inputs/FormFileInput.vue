<template>
    <div class="form-group" ref="inputWrapper"
         :class="{ 'is-invalid': !valid && contentChanged, 'is-valid': valid && contentChanged, 'active': active }">

        <label :for="name + '-input'" v-if="label" ref="inputLabel">
            <span>{{ label }}{{ required ? '*' : '' }}</span>
        </label>

        <div class="input-group" :class="[ color ? 'input-group-' + color : '', size ? 'input-group-' + size : '']">
            <span v-if="icon" class="input-group-addon">
                <icon :icon="icon"></icon>
            </span>

            <input type="text" v-model="submitValue" :name="name" style="display: none">

            <input :id="name + '-input'" type="file" :name="name + '-selector'" class="form-control"
                   @change="setImageValue"
                   :placeholder="placeholder ? placeholder : ''" :aria-label="placeholder ? placeholder : ''"
                   :disabled="disabled" ref="input" @focus="activate" @blur="deactivate">

            <span class="input-group-addon has-tooltip" v-if="help" ref="helpIcon">
                <icon icon="fa fa-question" :title="help" v-tooltip:left></icon>
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

        <span v-if="showMaxLengthCounter" class="counter">{{ submitValue ? submitValue.length : 0 }} / {{ max }}</span>
        <span v-if="showMinLengthCounter" class="counter">{{ submitValue ? submitValue.length : 0 }} / {{ min }}</span>
    </div>
</template>

<script>
    import formInputMixin from '../../mixins/TextFormInputMixin';

    export default {
        mixins: [formInputMixin],

        methods: {
            setImageValue: function () {
                let file    = this.$refs.input.files[0];
                let reader  = new FileReader();

                reader.onload = () => {
                    this.submitValue = reader.result;
                };

                if (file) {
                    reader.readAsDataURL(file);
                }
            }
        }
    }
</script>
