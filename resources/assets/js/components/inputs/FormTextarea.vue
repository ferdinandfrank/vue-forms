<template>
    <div class="form-group" ref="inputWrapper" :class="{ 'has-error': invalid && !valid, 'has-success': valid && submitValue }">
        <textarea :id="name + '-input'"
                  :name="name"
                  v-model="submitValue"
                  class="form-control"
                  :class="icon ? 'has-addon' : ''"
                  :disabled="disabled"
                  :placeholder="showPlaceholder ? placeholder : ''"
                  ref="input"
                  @focus="activate"
                  @blur="deactivate"></textarea>

        <button type="submit" v-if="icon && addonSubmit" class="form-group-addon" :style="{cursor: valid ? 'pointer' : 'not-allowed'}">
            <icon :icon="icon"></icon>
        </button>
        <span v-if="icon && !addonSubmit" class="form-group-addon">
            <icon :icon="icon"></icon>
        </span>

        <label :for="name + '-input'" v-if="showLabel" ref="inputLabel" :data-message="labelMessage">
            <span>{{ label }}</span>
            <span v-if="showHelp" class="tooltip">
                <i @click="openHelp" class="fa fa-fw fa-question help"></i>
                <span v-if="helpTooltip" class="tooltip-text">{{ helpTooltip }}</span>
            </span>
        </label>
        <span class="counter" :class="submitValue.length > maxLength ? 'error' : 'success'" v-if="showMaxLengthCounter">
            {{ submitValue.length + '/' + maxLength }}
        </span>
        <span class="counter" :class="submitValue.length < minLength ? 'error' : 'success'" v-if="showMinLengthCounter">
            {{ submitValue.length + '/' + minLength }}
        </span>
        <slot></slot>
    </div>
</template>

<script>
    import formInputMixin from '../../mixins/TextFormInputMixin';
    export default{
        mixins: [formInputMixin],
    }

</script>
