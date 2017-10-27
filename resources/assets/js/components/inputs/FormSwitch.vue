<template>
    <div class="form-group" ref="inputWrapper"
         :class="{ 'is-invalid': invalid && !valid, 'is-valid': valid && submitValue }">

        <div class="control-group"
             @click="toggleValue">
            <div :id="'switch-' + name" class="switch"  :class="[color ? 'switch-' + color : '', size ? 'switch-' + size : '' , submitValue ? 'on' : 'off']">
                <div class="on-background background-fill"></div>
                <div class="state-background background-fill"></div>
                <div class="handle"></div>
                <input :id="name + '-input'" type="checkbox" :name="name" ref="input" style="display: none;"
                       class="control-input"
                       v-model="submitValue"/>
            </div>
            <label>
                <span class="control-description" v-if="showLabel" ref="inputLabel">{{ label }}</span>
            </label>
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
    import checkboxInputMixin from '../../mixins/CheckboxInputMixin';

    export default {
        mixins: [checkboxInputMixin]
    }

</script>
