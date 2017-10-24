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

            <textarea :id="name + '-input'" class="form-control" :name="name" v-model="submitValue" rows="3"
                      :placeholder="showPlaceholder ? placeholder : ''" :aria-label="placeholder"
                      :disabled="disabled" ref="input" @focus="activate" @blur="deactivate"></textarea>

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

        <span v-if="showMaxLengthCounter" class="counter">{{ submitValue.length }} / {{ max }}</span>
        <span v-if="showMinLengthCounter" class="counter">{{ submitValue.length }} / {{ min }}</span>
    </div>
</template>

<script>
    import formInputMixin from '../../mixins/TextFormInputMixin';

    export default {
        mixins: [formInputMixin],
    }

</script>
