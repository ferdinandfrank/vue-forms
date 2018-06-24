import Alert from "../helpers/Alert";

import RemoveElementMixin from "./RemoveElementMixin";
import ValidationFormMixin from "./ValidationFormMixin";

export default {

    mixins: [RemoveElementMixin, ValidationFormMixin],

    props: {

        // The url where to submit the form.
        action: {
            type: String,
            required: true
        },

        // The method to use for the submit.
        method: {
            type: String,
            required: true
        },

        // The predefined data to submit with the form.
        data: {
            type: Object,
            default: () => {
                return {}
            }
        },

        // An object to define the messages to show to the user within a confirm alert, before the form will be submitted.
        // If not defined, no confirm message will be shown.
        // This object can contain the following key-value-pairs to modify the confirm alert:
        // - 'title': [The title of the confirm message]
        // - 'message': [The body message of the confirm message]
        // - 'type': [The alert type of the confirm dialog (info, success, warning [DEFAULT], error]
        // - 'accept': [The button text to show on the 'accept' button]
        // - 'cancel': [The button text to show on the 'cancel' button]
        confirm: {
            type: Object,
            default: null
        },

        // States if an error alert message shall be shown, if an error occurred.
        alertError: {
            type: Boolean,
            default: true
        },

        // The duration of the alert that will be shown after the form has been submitted.
        // Will only be used if the duration is not defined by the server response.
        alertDuration: {
            type: Number,
            default: 3000
        },

        // The base name of the events that get triggered by the form during a submit.
        eventName: {
            type: String,
            default: 'ajaxForm'
        },

        // The selector of the wrapper, where to append the response's data to.
        appendResponse: {
            type: String,
            default: null
        },

        // The selector of the wrapper, where to prepend the response's data to.
        prependResponse: {
            type: String,
            default: null
        },

        // The selector of the element, to replace with the response's data.
        replaceResponse: {
            type: String,
            default: null
        },

        // States if the form shall be submitted with ajax. Even though this is the purpose of this package,
        // it is sometimes useful to use the functionality of this package without submitting the form via ajax.
        ajax: {
            type: Boolean,
            default: true
        }
    },

    data() {
        return {

            // The submit button of the form. Used to show the loader as soon as the submit request is pending.
            button: null,

            // The html content to put in the submit button, while the form is submitting.
            loadingContent: '<i class="fa fa-fw fa-circle-o-notch fa-spin"></i>',

            // The html content to put in the loading button, after the form has been submitted and the loader has stopped.
            originalLoadingContent: '',

            // States if the form is currently beeing submitted
            loading: false,

            // Defines the keys to extract from the server response to define the further handling of the form
            serverKeys: {
                showAlert: 'alert',
                alert: {
                    title: 'title',
                    message: 'message',
                    accept: 'accept',
                    duration: 'duration',
                    type: 'type'
                },
                redirect: 'redirect',
                reload: 'reload',
                data: 'data',
                error: 'error'
            },

            // The editable data to submit with the form.
            submitData: {},
        }
    },

    watch: {

        /**
         * Watch the submit permission of the form, to enable or disable the submit button.
         *
         * @param isValid {@code true} if a submit is allowed, {@code false} otherwise.
         */
        valid(isValid) {
            window.eventHub.$emit('validated-' + this.eventName, isValid);
            this.button.prop('disabled', !isValid);
        },
    },

    mounted() {
        this.$nextTick(function () {

            this.initSubmitButton();

            // Insert Laravel CSRF token, if normal submit is specified
            if (!this.ajax) {
                let token = document.head.querySelector('meta[name="csrf-token"]');
                if (token) {
                    $(this.$el).prepend('<input type="hidden" name="_token" value="' + token.content + '">');
                } else {
                    console.warn('Vue Forms: No CSRF token specified.');
                }
            }
        })
    },

    methods: {

        /**
         * Tries to find a submit button within the form to use for showing a loading state on submit.
         */
        initSubmitButton() {
            this.button = $(this.$el).find('button[type=submit]').last();

            // Get the original content from the submit button to replace the loader with the original content
            // after the serve response was received
            if (this.button && this.button.length) {
                this.originalLoadingContent = this.button.html();
            }
        },

        /**
         * Starts the form submitting process.
         */
        submit(event) {

            // Check if the ajax submit of the form is disabled or enabled
            if (this.ajax) {
                if (event) {
                    event.preventDefault();
                }
            } else {
                this.startLoader();

                return true;
            }

            // Don't let the user submit the form, if some inputs are not valid
            if (!this.valid) {
                window.eventHub.$emit('prevented_submit-' + this.eventName, this);
                return;
            }

            // Let the user confirm his submit action, if a confirm is specified in the properties.
            if (this.confirm && _.isObject(this.confirm)) {
                let confirmTitle = this.confirm.hasOwnProperty('title') ? this.confirm.title : null;
                let confirmMessage = this.confirm.hasOwnProperty('message') ? this.confirm.message : null;
                let confirmAccept = this.confirm.hasOwnProperty('accept') ? this.confirm.accept : null;
                let confirmCancel = this.confirm.hasOwnProperty('cancel') ? this.confirm.cancel : null;
                let confirmType = this.confirm.hasOwnProperty('type') ? this.confirm.type : 'warning';

                new Alert(confirmMessage, confirmTitle, confirmType).confirm(confirmAccept, confirmCancel).then((confirmed) => {
                    if (confirmed) {
                        this.startLoader();
                        this.sendData();
                    }
                });

            } else {
                this.startLoader();
                this.sendData();
            }
        },

        /**
         * Shows the loader, if a loader shall be shown.
         */
        startLoader() {
            this.loading = true;
            if (this.button) {
                let buttonContent = this.button.html();
                if (buttonContent !== this.loadingContent) {
                    this.originalLoadingContent = buttonContent;
                }
                this.button.html(this.loadingContent);
                this.button.prop('disabled', true);
            }
        },

        /**
         * Stops the loader, if a loader is shown.
         */
        stopLoader() {
            this.loading = false;
            if (this.button) {
                this.button.html(this.originalLoadingContent);
                this.button.prop('disabled', false);
            }
        },

        /**
         * Sends the data of the form to the server.
         */
        sendData() {

            // Let the parent chain know, that the submit will be processed.
            window.eventHub.$emit('submitting-' + this.eventName, this);
            this.$emit('submitting');

            let data = Object.assign(this.data, this.submitData);
            let formData = {};

            _.each(this.inputs, function (input) {

                // Check if real input component
                if (input.name !== undefined && input.submitValue !== undefined) {

                    // If value already exists, build an array, e.g., multiple checkboxes, selects
                    if (formData.hasOwnProperty(input.name) && !_.isArray(formData[input.name])) {
                        formData[input.name] = [formData[input.name]];
                    }

                    // If value already exists add the new value to previously built array, e.g., multiple checkboxes, selects
                    if (formData.hasOwnProperty(input.name)) {
                        formData[input.name].push(input.submitValue);
                    } else {
                        formData[input.name] = input.submitValue;
                    }
                }
            });

            data = Object.assign(data, formData);

            $.ajax({
                type: this.method.toLowerCase(),
                url: this.action,
                data: data,
                success: response => {
                    this.handleResponse(true, response);
                },
                error: error => {
                    this.handleResponse(false, error.responseJSON);
                }
            });
        },

        /**
         * Handles the response from the server, after the form has been submitted.
         *
         * @param success {@code true} if the submit was successful, {@code false} otherwise.
         * @param response The response from the server.
         */
        handleResponse(success, response) {
            this.stopLoader();

            this.showAlert(response, success).then(() => {
                if (success) {
                    this.handleSuccess(response);
                } else {
                    this.$emit('error');
                    this.onError(response);
                }

                // Call the callback to handle the after submit action directly on the page.
                // The callback has 4 parameters (+ the callback name):
                // - eventName: The name of the event to listen to for the callback.
                // - success: {@code true} if the request was successful handled on the server, {@code false} otherwise.
                // - response: The response message retrieved from the server.
                // - method: The method that was used to proceed the request.
                // - component: The current instance of this component (useful to extract the form with 'component.$el'
                window.eventHub.$emit('response-' + this.eventName, success, response, this.method.toLowerCase(), this);

                this.redirectUser(response);

                this.validate();
            });
        },

        /**
         * Shows an alert based on the specified response and success field.
         *
         * @param response
         * @param success
         * @returns {Promise}
         */
        showAlert(response, success = true) {
            return new Promise((resolve) => {

                let message = null;
                let title = '';
                let accept = false;
                let duration = this.alertDuration;
                let type = success ? 'success' : 'error';

                if (response && response.hasOwnProperty(this.serverKeys.showAlert) && response[this.serverKeys.showAlert].hasOwnProperty(this.serverKeys.alert.message)) {
                    let alertInfo = response[this.serverKeys.showAlert];

                    message = alertInfo[this.serverKeys.alert.message];
                    if (alertInfo.hasOwnProperty(this.serverKeys.alert.title)) {
                        title = alertInfo[this.serverKeys.alert.title];
                    }
                    if (alertInfo.hasOwnProperty(this.serverKeys.alert.accept)) {
                        accept = alertInfo[this.serverKeys.alert.accept];
                    }
                    if (alertInfo.hasOwnProperty(this.serverKeys.alert.duration)) {
                        duration = alertInfo[this.serverKeys.alert.duration];
                    }
                    if (alertInfo.hasOwnProperty(this.serverKeys.alert.type)) {
                        type = alertInfo[this.serverKeys.alert.type];
                    }
                } else if (!success && this.alertError) {
                    title = VUE_FORMS_ERROR_DEFAULT.title;
                    message = VUE_FORMS_ERROR_DEFAULT.message;
                    accept = VUE_FORMS_ERROR_DEFAULT.accept;

                    // Check for Laravel >= 5.5 validation errors
                    if (response && response.hasOwnProperty('errors')) {

                        // Get the first validation error to show on the alert
                        message = response.errors[Object.keys(response.errors)[0]];

                        // Check if multiple error messages exist for that key
                        message = _.isArray(message) ? message[0] : message;

                        // Check for custom error message from server
                    } else if (response && response.hasOwnProperty(this.serverKeys.error)) {
                        message = response[this.serverKeys.error];

                        // Check for Laravel HTTP Exception error message
                    } else if (response && response.hasOwnProperty('message')) {
                        message = response['message'];
                    }
                }

                if (message) {
                    new Alert(message, title, type).show(accept, accept ? null : duration).then(() => {
                        resolve();
                    });
                } else {
                    resolve();
                }
            });
        },

        /**
         * Handles the successful response from the server.
         *
         * @param response The response from the server.
         */
        handleSuccess(response) {
            let data = null;
            if (response.hasOwnProperty(this.serverKeys.data)) {
                data = response[this.serverKeys.data];

                if (this.appendResponse) {
                    appendData(this.appendResponse, data);
                }

                if (this.prependResponse) {
                    prependData(this.prependResponse, data);
                }

                if (this.replaceResponse) {
                    replaceData(this.replaceResponse, data);
                }
            }
            this.removeElement();

            this.onSuccess(response);
            this.$emit('success', data);
        },

        /**
         * Redirects the user to the redirect path specified in the response
         */
        redirectUser(response) {
            if (response && response.hasOwnProperty(this.serverKeys.redirect)) {
                let redirect = response[this.serverKeys.redirect];
                let isSamePage = redirect.startsWith(window.location.href);
                window.location.href = redirect;
                if (isSamePage) {
                    window.location.reload(true);
                }
            } else if (response && response.hasOwnProperty(this.serverKeys.reload)) {
                window.location.reload(true);
            }
        },

        /**
         * Will be called if the form was successfully submitted.
         *
         * @param response The response from the server.
         */
        onSuccess(response) {
        },

        /**
         * Will be called if an error occurred on the form submit.
         *
         * @param response The response from the server.
         */
        onError(response) {
        },
    }
};