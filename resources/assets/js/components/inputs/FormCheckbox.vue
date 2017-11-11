<template>
    <div class="form-group" ref="inputWrapper"
         :class="{ 'is-invalid': !valid, 'is-valid': valid && submitValue, 'active': active }">

        <div class="control-group" :class="[ color ? 'control-group-' + color : '', size ? 'control-group-' + size : '']">
            <label class="control checkbox">
                <input :id="name + '-input'" :name="name" v-model="submitValue" type="checkbox" class="control-input">
                <span :id="name + '-checkbox-indicator'" class="control-indicator"></span>
                <span class="control-description" v-if="label" ref="inputLabel">{{ label }}</span>
            </label>
        </div>
        <small v-if="help" class="form-text text-muted">
            {{ help }}
        </small>
        <div class="invalid-feedback" v-if="errorMessage">{{ errorMessage }}</div>

    </div>
</template>

<script>
    import checkboxInputMixin from '../../mixins/CheckboxInputMixin';

    export default {
        mixins: [checkboxInputMixin],
    }

</script>
