<template>
    <div class="checkbox-wrapper" ref="inputWrapper" :class="{ 'has-error': invalid && !valid, 'has-success': valid && submitValue }" >
        <input :id="name + '-input'"
               type="checkbox"
               ref="input"
               :name="name"
               v-model="submitValue"/>
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
    }

</script>
