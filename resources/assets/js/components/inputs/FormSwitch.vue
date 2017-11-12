<template>
    <div class="form-group" ref="inputWrapper"
         :class="{ 'is-invalid': !valid && contentChanged, 'is-valid': valid && contentChanged, 'active': active }">

        <div class="control-group"
             @click="toggleValue">
            <div :id="'switch-' + name" class="switch"  :class="[color ? 'switch-' + color : '', size ? 'switch-' + size : '' , submitValue ? 'on' : 'off']">
                <div class="on-background background-fill"></div>
                <div class="state-background background-fill"></div>
                <div class="handle"></div>
                <input :id="name + '-input'" type="checkbox" :name="name" ref="input" style="display: none;"
                       class="control-input"
                       :value="submitValue"/>
            </div>
            <label>
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
        mixins: [checkboxInputMixin]
    }

</script>
