import Form from "./../helpers/Form";
import Alert from "../helpers/Alert";

export default {

    props: {

        // The url where to submit the form.
        action: {
            type: String,
            required: true
        },

        // The method to use for the submit.
        // See computed property: 'method'
        method: {
            type: String,
            required: true
        },

        // The predefined data to submit with the form
        data: {
            type: Object,
            default: null
        },

        // Check if a confirm message shall be shown, before the form is going to be submitted.
        confirm: {
            type: Boolean,
            default: false
        },

        // The type of the confirm alert to ask the user, if he really wants to submit the form.
        // Will only be used if the 'confirm' property is set to true.
        confirmType: {
            type: String,
            default: 'warning'
        },

        // The props to insert into the confirm message, if one shall be shown.
        // Will only be used if the 'confirm' property is set to true.
        confirmProps: {
            type: Object,
            default: null
        },

        // States if an error alert message shall be shown, if an error occurred.
        alertError: {
            type: Boolean,
            default: true
        },

        // The duration of the alert that will be shown after the form has been submitted.
        // Will only be used if the duration is not defined by the server response
        alertDuration: {
            type: Number,
            default: 3000
        },

        // The lang key to use to identify the messages to show to the user on a confirm alert.
        langKey: {
            type: String,
            default: 'default'
        },

        // The base name of the events that get triggered during a submit.
        eventName: {
            type: String,
            default: 'ajaxForm'
        },

        // The selector of the wrapper, where to append the response to.
        appendResponse: {
            type: String
        },

        // The selector of the wrapper, where to prepend the response to.
        prependResponse: {
            type: String
        },

        // The selector of the element, to replace with the response.
        replaceResponse: {
            type: String
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

            // The form instance containing the data to send.
            form: new Form(this.data),

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
                data: 'data',
                error: 'error'
            }
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
            if (this.button) {
                this.originalLoadingContent = this.button.html();
            }

            // Disable the submit permission to let the user make at least one change
            this.updateFormSubmitPermission();
        })
    },

    methods: {

        /**
         * Starts the form submitting process.
         */
        submit: function () {
            if (!this.valid) {
                window.eventHub.$emit('prevented_submit-' + this.eventName, this);
                return;
            }

            // Let the user confirm his submit action, if a confirm was defined in the properties.
            if (this.confirm) {
                let confirmTitle = this.getLocalizationString('confirm', 'title');
                let confirmMessage = this.getLocalizationString('confirm', 'message', this.confirmProps);
                let confirmAccept = this.getLocalizationString('confirm', 'accept');
                let confirmCancel = this.getLocalizationString('confirm', 'cancel');

                new Alert(confirmMessage, confirmTitle, this.confirmType).confirm(confirmAccept, confirmCancel).then((confirmed) => {
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

            this.form.submit(this.method.toLowerCase(), this.action)
                .then(response => {
                    this.handleResponse(true, response);
                })
                .catch(error => {
                    this.handleResponse(false, error);
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

            this.updateFormSubmitPermission();

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
                window.eventHub.$emit(this.eventName, success, response, this.method.toLowerCase(), this);

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
                    title = this.$t('alert.error.default.' + this.method.toLowerCase() + '.title');
                    message = this.$t('alert.error.default.' + this.method.toLowerCase() + '.message');
                    accept = this.$t('confirm.default.error.accept');

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
            }
        },

        /**
         * Gets the localization string for an alert type and a type and falls back to the default if necessary.
         *
         * @param alertType 'alert' or 'confirm'
         * @param type 'title', 'message', 'cancel' or 'accept'
         * @param params localization params
         * @returns {string}
         */
        getLocalizationString: function (alertType, type, params = null) {
            let key = alertType + '.' + this.langKey + '.' + this.method.toLowerCase() + '.' + type;
            let defaultKey = alertType + '.default.' + this.method.toLowerCase() + '.' + type;
            let text = this.$t(key, params);
            if (key === text) {
                text = this.$t(defaultKey, params);
            }

            return text;
        },

        /**
         * Updates the state of the submit button and checks if the form can be submitted,
         * depending if the child inputs allow a submit.
         */
        updateFormSubmitPermission: function () {
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

