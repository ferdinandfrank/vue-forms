<template>
    <div class="form-group" ref="inputWrapper"
         :class="{ 'has-error': invalid && !valid, 'has-success': valid && submitValue }">
        <textarea :id="name + '-input'" :name="name" :style="{display: 'none'}" v-model="submitValue"
                  ref="input"></textarea>

        <div :id="name + '-toolbar'" ref="toolbox" class="codearea-toolbox"
             :style="{display: active ? 'block' : 'none'}">
            <div class="codearea-toolbox-header">
                <div class="codearea-mover"></div>
                <div class="codearea-mover"></div>
                <div class="codearea-mover"></div>
            </div>
            <div class="codearea-tools">
                <div class="codearea-tools-group" v-for="(toolCategory, toolCategoryName) in tools">
                    <div class="codearea-tools-group-title">
                        {{ $t('labels.codearea.titles.' + toolCategoryName) }}
                    </div>
                    <div class="codearea-tools-group-buttons">
                        <div v-for="(tool, toolName) in toolCategory"
                             :title="$t('labels.codearea.' + toolCategoryName + '.' + (tool.lang ? tool.lang : toolName))"
                             class="codearea-tool-button" :style="tool.style" :class="{'active': !tool.inactive && ((formats && ((tool.toolName && formats[tool.toolName] === tool.toolValue) || formats[toolName] || formats[toolCategoryName] == toolName)) || (toolName === 'default' && (!formats || !formats[toolCategoryName]))),
                             'disabled': tool.hasOwnProperty('disabled') ? tool.disabled() : false}"
                             @click="callToolbarAction(toolCategoryName, toolName, tool)">
                            <icon :icon="'fa fa-' + (tool.icon ? tool.icon : toolName)"></icon>
                        </div>
                    </div>
                </div>
            </div>
            <div class="codearea-toolbox-footer">
                <p>{{ $t('labels.words') }}: {{ wordCount }}</p>
                <p>{{ $t('labels.chars') }}: {{ charCount }}</p>
            </div>
        </div>

        <div class="codearea">
            <div :id="name + '-codearea'" v-html="value"></div>
        </div>

        <label :for="name + '-input'" v-if="showLabel" ref="inputLabel" :data-message="labelMessage">
            <span>{{ label }}</span>
            <span v-if="showHelp" class="tooltip">
                <i @click="openHelp" class="fa fa-fw fa-question help"></i>
                <span v-if="tooltipText" class="tooltip-text">{{ tooltipText }}</span>
            </span>
        </label>

        <media-modal v-if="showMediaManager" v-on:close="showMediaManager = false">
            <media-manager :is-modal="true" :selected-event-name="name + '-media'"
                           v-on:close="showMediaManager = false"></media-manager>
        </media-modal>
    </div>
</template>

<script>
    import formInputMixin from '../../mixins/FormInputMixin';
    import Alert from "../../helpers/Alert";

    export default {
        mixins: [formInputMixin],

        props: {},

        data: function () {
            return {

                // The main quill instance
                quill: null,

                // The editable box of the quill instance
                editor: null,

                // States if the editable box is currently active, i.e., can be edited
                active: false,

                // The currently active formats of the current cursor selection
                formats: {},

                // The current selection of the cursor
                selection: null,

                // The available tools of the toolbox
                tools: {
                    size: {
                        large: {icon: 'font large'},
                        'default': {icon: 'font'},
                        small: {icon: 'font small'}
                    },
                    header: {
                        1: {icon: 'header large'},
                        2: {icon: 'header'},
                        3: {icon: 'header small'}
                    },
                    font_transformation: {
                        bold: {
                            action: () => {
                                this.format('bold')
                            }
                        },
                        italic: {
                            action: () => {
                                this.format('italic')
                            }
                        },
                        underline: {
                            action: () => {
                                this.format('underline')
                            }
                        },
                        superscript: {
                            action: () => {
                                this.format('script', 'super')
                            }, toolName: 'script', toolValue: 'super'
                        },
                        subscript: {
                            action: () => {
                                this.format('script', 'sub')
                            }, toolName: 'script', toolValue: 'sub'
                        }
                    },
                    list: {
                        bullet: {icon: 'list-ul'},
                        ordered: {icon: 'list-ol'}
                    },
                    color: {
                        'default': {icon: 'paint-brush'},
                        '#008200': {icon: 'paint-brush', style: {color: '#008200'}, lang: 'green'},
                        '#f0820a': {icon: 'paint-brush', style: {color: '#f0820a'}, lang: 'orange'},
                        '#d2322d': {icon: 'paint-brush', style: {color: '#d2322d'}, lang: 'red'},
                        '#808697': {icon: 'paint-brush', style: {color: '#808697'}, lang: 'grey'},
                        '#4267b2': {icon: 'paint-brush', style: {color: '#4267b2'}, lang: 'blue'},
                    },
                    insert_options: {
                        link: {
                            action: () => {
                                this.addLink()
                            }, icon: 'link', disabled: () => {
                                return !this.textSelected;
                            }
                        },
                        image: {
                            action: () => {
                                this.selectMedia()
                            }, icon: 'camera'
                        },
                        video: {
                            action: () => {
                                this.addYouTubeVideo()
                            }, icon: 'youtube'
                        },
                        hr: {
                            action: () => {
                                this.addEmbed('hr', true)
                            }, icon: 'minus-square-o'
                        },
                    },
                    align: {
                        'default': {icon: 'align-left'},
                        center: {icon: 'align-center'},
                        right: {icon: 'align-right'}
                    },
                    action: {
                        indent: {
                            action: () => {
                                this.format('indent', '+1')
                            }, inactive: true, disabled: () => {
                                return this.formats && this.formats.hasOwnProperty('indent') && this.formats.indent > 7;
                            }
                        },
                        outdent: {
                            action: () => {
                                this.format('indent', '-1')
                            }, inactive: true, disabled: () => {
                                return !(this.formats && this.formats.hasOwnProperty('indent'));
                            }
                        },
                        undo: {
                            action: () => {
                                this.undo()
                            }, inactive: true, disabled: () => {
                                return !(this.quill && this.quill.history.stack.undo.length);
                            }
                        },
                        redo: {
                            action: () => {
                                this.redo()
                            }, icon: 'repeat', inactive: true, disabled: () => {
                                return !(this.quill && this.quill.history.stack.redo.length);
                            }
                        },
                        'delete': {
                            action: () => {
                                this.deleteContent()
                            }, icon: 'trash', inactive: true, disabled: () => {
                                return !this.charCount;
                            }
                        },
                    }
                },

                // The number of words of the content
                wordCount: 0,

                // The number of characters of the content
                charCount: 0,

                // States if the media manager to select an image or video is currently shown
                showMediaManager: false,

                // The position of the cursor. Used to insert an embed or image after the selection on the media manager.
                cursorIndex: null
            }
        },

        computed: {

            // States if the cursor has currently more than 1 character selected
            textSelected: function () {
                return this.selection && this.selection.length > 0;
            },
        },

        watch: {
            contentChanged: function (changed) {
                if (changed) {
                    window.onbeforeunload = (e) => {
                        return '';
                    };
                }
            },

            active: function (isActive) {
                this.quill.enable(isActive);
            }
        },

        mounted() {
            this.$nextTick(function () {

                // Initialize the toolbox to make it draggable
                $(this.$refs.toolbox).draggable({
                    start: function () {
                        $(this).addClass('dragged');
                    },
                    stop: function () {
                        $(this).removeClass('dragged');
                    }
                });

                // Init the main quill instance
                this.quill = new Quill('#' + this.name + '-codearea', {
                    modules: {
                        toolbar: '#' + this.name + '-toolbar',
                        imageResize: {
                            modules: ['Resize', 'DisplaySize']
                        },
                        keyboard: {
                            bindings: {
                                smartbreak: {
                                    key: 13,
                                    shiftKey: true,
                                    handler: function (range, context) {
                                        this.quill.setSelection(range.index, 'silent');
                                        this.quill.insertText(range.index, '\n', 'user');
                                        this.quill.setSelection(range.index + 1, 'silent');
                                        this.quill.format('linebreak', true, 'user');
                                    }
                                },
                                paragraph: {
                                    key: 13,
                                    handler: function (range, context) {
                                        this.quill.setSelection(range.index, 'silent');
                                        this.quill.insertText(range.index, '\n', 'user');
                                        this.quill.setSelection(range.index + 1, 'silent');
                                        let f = this.quill.getFormat(range.index + 1);
                                        if (f.hasOwnProperty('linebreak')) {
                                            delete(f.linebreak);
                                            this.quill.removeFormat(range.index + 1);
                                            for (let key in f) {
                                                this.quill.formatText(range.index + 1, key, f[key]);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                });


                // Init the main editor instance
                this.editor = $('#' + this.name + '-codearea').children('.ql-editor')[0];

                this.initListeners();
                this.updateCounts();
            });
        },

        methods: {

            // Enables the editing of the content
            enableEdit: function () {
                this.active = true;
            },

            // Disables the editing of the content
            disableEdit: function () {
                this.active = false;
            },

            // Calls a format action from the toolbar
            callToolbarAction: function (toolCategory, toolName, tool) {
                if (!(tool.hasOwnProperty('disabled') ? tool.disabled() : false)) {
                    tool.hasOwnProperty('action') ? tool.action() : this.format(toolCategory, toolName === 'default' ? false : toolName)
                }
            },

            // Formats the currently selected text
            format: function (name, value = null, source = 'user') {
                let oldValue = this.formats && this.formats[name] ? this.formats[name] : false;
                if (value === null || value === oldValue) {
                    value = !oldValue;
                }

                this.quill.format(name, value, source);
                this.updateFormats();
            },

            // Formats the text at the specified index with the specified length
            formatText: function (index, length, name, value, source = 'user') {
                this.quill.formatText(index, length, name, value, source);
                this.updateFormats();
            },

            // Updates the currently active formats of the current selection
            updateFormats: function () {
                let selection = this.quill.getSelection();
                this.selection = selection;
                if (selection !== null) {
                    this.formats = this.quill.getFormat();
                }
            },

            // Adds a link to the currently selected text
            addLink: function () {
                let selection = this.quill.getSelection(true);
                new Alert(this.$t('prompt.add_link.content'), this.$t('prompt.add_link.title')).ask(this.$t('prompt.add_link.confirm'), this.$t('prompt.add_link.cancel'), this.$t('prompt.add_link.placeholder')).then((link) => {
                    this.formatText(selection.index, selection.length, 'link', link);
                });
            },

            // Adds a YouTube video to the current selected text position
            addYouTubeVideo: function () {
                this.cursorIndex = this.quill.getSelection(true).index;
                new Alert(this.$t('prompt.add_youtube.content'), this.$t('prompt.add_youtube.title')).ask(this.$t('prompt.add_youtube.confirm'), this.$t('prompt.add_youtube.cancel'), this.$t('prompt.add_youtube.placeholder')).then((link) => {
                    link = link.replace("watch?v=", "embed/"); // Necessary for authentication
                    this.addEmbed('video', link, false);
                });
            },

            // Adds an embed entity to the text at the current position
            addEmbed: function (type = 'image', value, useCurrentPosition = true, source = 'user') {
                if (!this.cursorIndex || useCurrentPosition) {
                    this.cursorIndex = this.quill.getSelection(true).index;
                }

                this.quill.insertEmbed(this.cursorIndex, type, value, source);
            },

            // Opens the media manager for selecting an image or a video
            selectMedia: function () {
                let selection = this.quill.getSelection(true);
                this.cursorIndex = selection ? selection.index : null;
                this.showMediaManager = true;
            },

            // Undoes the last action
            undo: function () {
                this.quill.history.undo();
            },

            // Redoes the last reversed action
            redo: function () {
                this.quill.history.redo();
            },

            // Deletes the last character or the next character (if at index 0) from the content at the current position
            deleteContent: function (source = 'user') {
                let range = this.quill.getSelection(true);
                let index = range.index > 0 ? range.index - 1 : range.index;
                let length = range.length ? range.length : 1;
                this.quill.deleteText(index, length, source);
            },

            // Updates the word and character counts in respect to the content
            updateCounts: function () {
                let text = this.quill.getText();
                text = text.replace(/[\n\r]+/g, ' '); // Replace new line characters with a blank
                text = text.trim();
                this.charCount = text.length;
                this.wordCount = text.length > 0 ? text.split(/\s+/).length : 0;
            },

            // Initializes the mandatory listeners
            initListeners: function () {

                // On text change, update the submit value and the word counts
                this.quill.on('text-change', () => {
                    this.submitValue = $(this.editor).html();
                    this.updateCounts();
                });

                // On cursor position change, update the active formats
                $(this.editor).bind("keydown click focus", () => {
                    this.updateFormats();
                });

                // On selected image or video, insert it into the content
                window.eventHub.$on('media-manager-selected-' + this.name + '-media', (file) => {
                    let source = file.webPath;
                    let fileType = source.split('.').pop();

                    if (fileType === 'png' || fileType === 'jpg' || fileType === 'jpeg' || fileType === 'gif') {
                        this.addEmbed('image', source, false);
                    } else {
                        this.addEmbed('video', source, false);
                    }

                    this.showMediaManager = false;
                });

                window.eventHub.$on('ajaxFormSubmit', function () {
                    window.onbeforeunload = null;
                });

                // On click at the editor box, activate the editing of the codearea
                $(this.editor).on('click', () => {
                    this.enableEdit();
                });

                // On click outside the editor and the toolbox, deactivate the editing of the codearea
                $(window).click((event) => {
                    if (!$(event.target).closest(this.$el).length) {
                        this.disableEdit();
                    }
                });
            }

        }
    }

</script>