<template>
    <div class="form-group" ref="inputWrapper" :class="{ 'has-error': invalid && !valid, 'has-success': valid && submitValue }">
        <textarea :id="name + '-input'"
                  :name="name"
                  :style="{display: 'none'}"
                  v-model="submitValue"
                  ref="input"></textarea>
        <div data-editable :data-name="name" class="codearea" @click="editContent" v-html="submitValue"></div>
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
    import formInputMixin from '../../mixins/FormInputMixin';
    export default{
        mixins: [formInputMixin],

        data: function () {
            return {

                // The editor instance.
                editor: ''
            }
        },

        mounted() {
            this.$nextTick(function () {

                $(window).click((event) => {
                    if (!$(event.target).closest('.ct-widget').length) {
                        this.saveContent();
                    }
                });

                this.editor = ContentTools.EditorApp.get();
                this.editor.init('[data-editable]', 'data-name');

                this.editor.addEventListener('saved', (ev) => {

                    // Check if something changed
                    let regions = ev.detail().regions;
                    if (Object.keys(regions).length == 0) {
                        return;
                    }

                    if (regions.hasOwnProperty(this.name)) {
                        this.submitValue = regions[this.name];
                    }

                });
            });
        },

        methods: {

            // Allows to edit the content
            editContent: function (event) {
                event.stopPropagation();
                if (!this.editor.isEditing()) {
                    this.editor.start();
                }
            },

            // Saves the edited content
            saveContent: function () {
                if (this.editor.isEditing()) {
                    this.editor.stop(true);
                }
            }
        }
    }

</script>
