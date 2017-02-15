<template>
    <div class="form-group" ref="inputWrapper" :class="{ 'has-error': invalid && !valid, 'has-success': valid && submitValue }">
        <div class="switch" :class="[color ? 'switch-' + color : '', size ? 'switch-' + size : '' ]"
             @click="toggleValue">
            <div class="ios-switch" :class="submitValue ? 'on' : 'off'">
                <div class="on-background background-fill"></div>
                <div class="state-background background-fill"></div>
                <div class="handle"></div>
            </div>
            <input :id="name + '-input'"
                   type="checkbox"
                   :name="name"
                   ref="input"
                   style="display: none;"
                   v-model="submitValue"/>
        </div>
        <label :for="name + '-input'" v-if="showLabel" ref="inputLabel" :data-message="labelMessage">
            <span>{{ label }}</span>
            <span v-if="showHelp" class="tooltip">
                <i @click="openHelp" class="fa fa-fw fa-question help"></i>
                <span v-if="helpTooltip" class="tooltip-text">{{ helpTooltip }}</span>
            </span>
        </label>
    </div>
</template>

<script>
    import checkboxInputMixin from '../../mixins/CheckboxInputMixin';
    export default{
        mixins: [checkboxInputMixin],
        props: {

            // The size of the switch.
            size: {
                type: String,
                default: 'sm'
            },

            // The color of the switch.
            color: {
                type: String,
                default: 'primary'
            },
        }
    }

</script>
