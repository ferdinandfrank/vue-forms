import Alert from "../helpers/Alert";

import removeElementMixin from "./RemoveElementMixin";

export default {

    mixins: [removeElementMixin],

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

    computed: {

        // The submit button of the form. Used to show the loader as soon as the submit request is pending.
        button: function () {
            return $(this.$el).find('button[type=submit]');
        }
    },

    data() {
        return {

            // States, if the form can be submitted.
            valid: true,

            // The html content to put in the submit button, while the form is submitting.
            loadingContent: '<i class="fa fa-fw fa-circle-o-notch fa-spin"></i>',

            // The html content to put in the loading button, after the form has been submitted and the loader has stopped.
            originalLoadingContent: '',

            // Defines the keys to extract from the server response to define the further handling of the form
            serverKeys: {
                showAlert: 'alert',
                alert: {
                    title: 'title',
                    message: 'message',
                    accept: 'accept',
                    duration: 'duration'
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
        valid: function (isValid) {
            window.eventHub.$emit('validated-' + this.eventName, isValid);
            this.button.prop('disabled', !isValid);
        },
    },

    mounted: function () {
        this.$nextTick(function () {

            // Get the original content from the submit button to replace the loader with the original content
            // after the serve response was received
            if (this.button) {
                this.originalLoadingContent = this.button.html();
            }

            // Disable the submit permission to let the user make at least one change
            this.validate();

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
         * Starts the form submitting process.
         */
        submit: function (event) {

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
        startLoader: function () {
            if (this.button) {
                this.originalLoadingContent = this.button.html();
                this.button.html(this.loadingContent);
                this.button.prop('disabled', true);
            }
        },

        /**
         * Stops the loader, if a loader is shown.
         */
        stopLoader: function () {
            if (this.button) {
                this.button.html(this.originalLoadingContent);
                this.button.prop('disabled', false);
            }
        },

        /**
         * Sends the data of the form to the server.
         */
        sendData: function () {

            // Let the parent chain know, that the submit will be processed.
            window.eventHub.$emit('submitting-' + this.eventName, this);

            let data = Object.assign(this.data, this.submitData);
            let inputs = $(this.$el).serializeArray();
            _.each(inputs, function (input) {
                if (input.hasOwnProperty('name')) {

                    // Transform checkbox 'on'/'off' values to 'real' booleans
                    if (input.value === 'on') {
                        input.value = 1;
                    } else if (input.value === 'off') {
                        input.value = 0;
                    }

                    data[input.name] = input.value;
                }
            });

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
        handleResponse: function (success, response) {
            this.stopLoader();

            this.validate();

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
            });
        },

        /**
         * Shows an alert based on the specified response and success field.
         *
         * @param response
         * @param success
         * @returns {Promise}
         */
        showAlert: function (response, success = true) {
            return new Promise((resolve) => {

                let message = null;
                let title = '';
                let accept = false;
                let duration = this.alertDuration;

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
                } else if (!success) {
                    title = 'Sorry!';
                    message = 'An unknown error occurred! Please try again later.';
                    accept = 'Ok!';

                    if (response && response.hasOwnProperty(this.serverKeys.error)) {
                        message = response[this.serverKeys.error];
                    } else if (response) {
                        for (let key in response) {
                            if (response.hasOwnProperty(key)) {
                                message = response[key];
                                break;
                            }
                        }
                    }
                }

                if (message) {
                    new Alert(message, title, success ? 'success' : 'error').show(accept, accept ? null : duration).then(() => {
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
        handleSuccess: function (response) {
            if (this.method.toLowerCase() === 'get') {
                updateHrefParamsWithData(this.form.data());
            }

            if (response.hasOwnProperty(this.serverKeys.data)) {
                let data = response[this.serverKeys.data];

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
            this.$emit('success');
        },

        /**
         * Redirects the user to the redirect path specified in the response
         */
        redirectUser: function (response) {
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
         * Updates the state of the submit button and checks if the form can be submitted,
         * depending if the child inputs allow a submit.
         */
        validate: function () {
            let allInputsValid = true;
            let children = getListOfChildren(this);
            for (let index in children) {
                let child = children[index];
                if (child.hasOwnProperty("valid") && !child.valid) {
                    allInputsValid = false;
                }
            }

            this.valid = allInputsValid;
        },

        /**
         * Will be called if the form was successfully submitted.
         *
         * @param response The response from the server.
         */
        onSuccess: function (response) {
        },

        /**
         * Will be called if an error occurred on the form submit.
         *
         * @param response The response from the server.
         */
        onError: function (response) {
        },
    }
};