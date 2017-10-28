<template>
    <div class="form-group" ref="inputWrapper"
         :class="{ 'is-invalid': invalid && !valid, 'is-valid': valid && contentChanged }">

        <label :for="name + '-input'" v-if="showLabel" ref="inputLabel">
            <span>{{ label }}</span>
        </label>

        <div class="input-group" :class="[ color ? 'input-group-' + color : '', size ? 'input-group-' + size : '']">
            <span v-if="icon" class="input-group-addon">
                <icon :icon="icon"></icon>
            </span>

            <input :id="name + '-input'" type="text" :name="name" v-model="submitValue" class="form-control datetimepicker"
                   :placeholder="showPlaceholder ? placeholder : ''" :aria-label="placeholder"
                   :disabled="disabled" ref="input" @focus="activate" @blur="deactivate">

            <span class="input-group-addon has-tooltip" v-if="help" ref="helpIcon">
                <icon icon="fa fa-question"></icon>
            </span>

            <span class="input-group-btn" v-if="showAddonSubmit">
                <button class="btn" :class="addonSubmitColor ? 'btn-' + addonSubmitColor : ''"
                        type="submit">{{ addonSubmitContent }}</button>
            </span>
        </div>
    </div>
</template>

<script>
    import formInputMixin from '../../mixins/TextFormInputMixin';
    import datePickerMixin from '../../mixins/DatePickerMixin';

    export default {
        mixins: [formInputMixin, datePickerMixin],

        mounted: function () {
            this.$nextTick(function () {
                this.submitValue = moment(this.value).format("YYYY-MM-DD");

                $(this.$refs.input).datetimepicker({
                    locale: moment.locale(),
                    format: 'DD.MM.YYYY',
                    defaultDate: moment(this.value)
                });
                $(this.$refs.input).on("dp.change", (moment) => {
                    this.submitValue = moment.date.format("YYYY-MM-DD");
                });
            })
        },
    }
</script>
