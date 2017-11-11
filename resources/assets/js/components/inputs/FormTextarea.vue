<template>
    <div class="form-group" ref="inputWrapper"
         :class="{ 'is-invalid': !valid, 'is-valid': valid && contentChanged, 'active': active }">

        <label :for="name + '-input'" v-if="label" ref="inputLabel">
            <span>{{ label }}</span>
        </label>

        <div class="input-group" :class="[ color ? 'input-group-' + color : '', size ? 'input-group-' + size : '']">
            <span v-if="icon" class="input-group-addon">
                <icon :icon="icon"></icon>
            </span>

            <textarea :id="name + '-input'" class="form-control" :name="name" v-model="submitValue" :rows="rows"
                      :placeholder="placeholder ? placeholder : ''" :aria-label="placeholder ? placeholder : ''"
                      :disabled="disabled" ref="input" @focus="activate" @blur="deactivate"></textarea>

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

        <span v-if="showMaxLengthCounter" class="counter">{{ submitValue.length }} / {{ max }}</span>
        <span v-if="showMinLengthCounter" class="counter">{{ submitValue.length }} / {{ min }}</span>
    </div>
</template>

<script>
    import formInputMixin from '../../mixins/TextFormInputMixin';

    export default {
        mixins: [formInputMixin],

        props: {

            // The textarea's native 'rows' attribute to define the height of the textarea.
            rows: {
                type: Number,
                default: 3
            }
        }
    }

</script>
