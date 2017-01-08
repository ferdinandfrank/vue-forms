<template>
    <div class="form-group" ref="inputWrapper" :class="{ 'has-error': invalid && !valid, 'has-success': valid && submitValue  }">
        <input :id="name + '-input'"
               type="text"
               :name="name"
               class="form-control datetimepicker"
               :class="icon ? 'has-addon' : ''"
               :placeholder="showPlaceholder ? label : ''"
               :disabled="disabled"
               ref="input"
               @focus="activate"
               @blur="deactivate">

        <button type="submit" v-if="icon && addonSubmit" class="form-group-addon" :style="{cursor: valid ? 'pointer' : 'not-allowed'}">
            <icon :icon="icon"></icon>
        </button>
        <span v-if="icon && !addonSubmit" class="form-group-addon">
            <icon :icon="icon"></icon>
        </span>

        <label :for="name + '-input'" v-if="showLabel" ref="inputLabel" :data-message="labelMessage">
            <span>{{ label }}</span>
            <i v-if="showHelp" @click="openHelp" class="fa fa-fw fa-question help"></i>
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
    import formInputMixin from '../../mixins/FormInputMixin';
    import datePickerMixin from '../../mixins/DatePickerMixin';
    export default{
        mixins: [formInputMixin, datePickerMixin],

        mounted: function () {
            this.$nextTick(function () {
                $(this.$refs.input).datetimepicker({
                    locale: 'de',
                    format: 'YYYY-MM-DD HH:mm:ss',
                    defaultDate: this.submitValue
                });
                $(this.$refs.input).on("dp.change", (moment) => {
                    this.submitValue = moment.date.format("YYYY-MM-DD HH:mm:ss");
                });
            })
        },
    }
</script>
