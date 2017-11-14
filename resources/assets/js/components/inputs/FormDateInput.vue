<template>
    <div class="form-group" ref="inputWrapper"
         :class="{ 'is-invalid': !valid && contentChanged, 'is-valid': valid && contentChanged, 'active': active }">

        <label :for="name + '-input'" v-if="label" ref="inputLabel">
            <span>{{ label }}{{ required ? '*' : '' }}</span>
        </label>

        <div class="input-group" :class="[ color ? 'input-group-' + color : '', size ? 'input-group-' + size : '']">
            <span v-if="icon" class="input-group-addon">
                <icon :icon="icon"></icon>
            </span>

            <input :id="name + '-input'" type="text" :name="name" v-model="submitValue" class="form-control datetimepicker"
                   :placeholder="placeholder ? placeholder : ''" :aria-label="placeholder ? placeholder : ''"
                   :disabled="disabled" ref="input" @focus="activate" @blur="deactivate">

            <span class="input-group-addon has-tooltip" v-if="help" ref="helpIcon">
                <icon icon="fa fa-question" :title="help" v-tooltip:left></icon>
            </span>

            <span class="input-group-btn" v-if="showAddonSubmit">
                <button class="btn" :class="addonSubmitColor ? 'btn-' + addonSubmitColor : ''"
                        type="submit">{{ addonSubmitContent }}</button>
            </span>
        </div>

        <div class="invalid-feedback" v-if="errorMessage">{{ errorMessage }}</div>

    </div>
</template>

<script>
    import formInputMixin from '../../mixins/TextFormInputMixin';

    export default {
        mixins: [formInputMixin],

        props: {

            // The format to use on the date picker. If a time is specified, the picker will automatically show
            // a time picker as well, e.g., for the format 'YYYY-MM-DD HH:mm:ss'
            format: {
                type: String,
                default: "YYYY-MM-DD"
            }
        },

        mounted: function () {
            this.$nextTick(function () {
                let momentValue = moment();
                if (this.value) {
                    momentValue = moment(this.value);
                }
                this.submitValue = momentValue.format(this.format);

                $(this.$refs.input).datetimepicker({
                    locale: moment.locale(),
                    format: this.format,
                    defaultDate: momentValue
                });
                $(this.$refs.input).on("dp.change", (moment) => {
                    this.submitValue = moment.date.format(this.format);
                });
            })
        },
    }
</script>
