import Form from "./../helpers/Form";

module.exports = {

    props: {
        // The default submit action of the form.
        // See computed property: 'submitAction'
        action: {
            type: String,
            required: true
        },

        // The method to use for the submit.
        // See computed property: 'submitMethod'
        method: {
            type: String,
            required: true
        },

        // Check if a confirm message shall be shown, before the form is going to be submitted.
        // Note: There will always be a confirm message, if the method is set to 'delete'.
        // See computed property: 'showConfirm'
        confirm: {
            type: Boolean,
            default: false
        },

        // Check if an alert message shall be shown, after the request from the server has been received.
        // Note: There will always be an alert if an error occurred, no matter how this property is set.
        // To prevent an error alert set the 'alertError' property to false.
        // Note2: There will be no alert on 'get' requests by default. Except the property 'alertKey' is set.
        // See computed property: 'showAlert'
        alert: {
            type: Boolean,
            default: true
        },

        // Set to false, to not show an error message, if an error occurred.
        alertError: {
            type: Boolean,
            default: true
        },

        // The key to use to identify the messages to show to the user on an alert or on a confirm alert.
        alertKey: {
            type: String,
            default: 'default'
        },

        // The name of the object to make this request. Used for delete and update confirms.
        objectName: {
            type: String
        },

        // The type of the confirm alert to ask the user, if he really wants to submit the form.
        // Will only be of use if the 'confirm' property is set to true.
        confirmType: {
            type: String,
            default: 'warning'
        },

        // The duration of the alert, that will be shown after the form has been submitted.
        alertDuration: {
            type: Number,
            default: 3000
        },

        // Set to false, if the loader shall not be reset after a response from the server has been received.
        // Useful if the user shall be redirected after the submit.
        stopLoading: {
            type: Boolean,
            default: true
        },

        // The name of the event to call, after the form has been submitted.
        callbackName: {
            type: String,
            default: 'ajaxFormResponse'
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
        },

        // The link to redirect the user after the form was successfully submitted.
        // If this property is not set, no redirect will occur.
        redirect: {
            type: String
        }
    },

    computed: {

        // The submit button of the form. Used to show the loader as soon as the submit request is pending.
        button: function() {
            return $(this.$el).find('button[type=submit]');
        },

        // The title of the alert to show after the request from the server has been received.
        // Will be determined by the 'alertKey' property and the method of the next submit.
        // Will only be of use if the 'alert' property is set to true.
        alertTitle: function () {
            return this.getLocalizationString('alert', 'title');
        },

        // The message of the alert to show after the request from the server has been received.
        // Will be determined by the 'alertKey' property and the method of the next submit.
        // Will only be of use if the 'alert' property is set to true.
        alertMessage: function () {
            if ((this.submitMethod == 'delete' || this.submitMethod == 'put')
                && this.objectName) {
                return this.getLocalizationString('alert', 'content', {name: this.objectName});
            }

            return this.getLocalizationString('alert', 'content');
        },

        // The title of the confirm alert to ask the user, if he really wants to submit the form.
        // Will be determined by the 'alertKey' property and the method of the next submit.
        // Will only be of use if the 'confirm' property is set to true.
        confirmTitle: function () {
            return this.getLocalizationString('confirm', 'title');
        },

        // The message of the confirm alert to ask the user, if he really wants to submit the form.
        // Will be determined by the 'alertKey' property and the method of the next submit.
        // Will only be of use if the 'confirm' property is set to true.
        confirmMessage: function () {
            if ((this.submitMethod == 'delete' || this.submitMethod == 'put')
                && this.objectName) {
                return this.getLocalizationString('confirm', 'content', {name: this.objectName});
            }

            return this.getLocalizationString('confirm', 'content');
        },

        // The text of the confirm alert's ACCEPT button to ask the user, if he really wants to submit the form.
        // Will be determined by the 'alertKey' property and the method of the next submit.
        // Will only be of use if the 'confirm' property is set to true.
        confirmAccept: function () {
            return this.getLocalizationString('confirm', 'accept');
        },

        // The text of the confirm alert's CANCEL button to ask the user, if he really wants to submit the form.
        // Will be determined by the 'alertKey' property and the method of the next submit.
        // Will only be of use if the 'confirm' property is set to true.
        confirmCancel: function () {
            return this.getLocalizationString('confirm', 'cancel');
        },

        // Holds the state, if a confirm message shall be shown before the submit.
        // Note: A confirm message will always be shown, if the method is set to 'delete'.
        showConfirm: function () {
            if (!this.confirm && this.submitMethod == 'delete') {
                return true;
            }
            return this.confirm;
        },

        // Holds the state, if an alert message shall be shown after the submit.
        // Note: An alert message won't be shown, if the method is set to 'get'.
        showAlert: function () {
            if (this.submitMethod == 'get' && this.alertKey == 'default') {
                return false;
            }
            return this.alert;
        }
    },

    data() {
        return {
            // The url, where to send the form request.
            submitAction: this.action,

            // The method to use for the submit.
            submitMethod: this.method.toLowerCase(),

            // States, if the form can be submitted.
            valid: true,

            // The html content to put in the loading button, after the form has been submitted and the loader has stopped.
            originalLoadingContent: '',

            // The html content to put in the submit button, while the form is submitting.
            loadingContent: '<i class="fa fa-fw fa-circle-o-notch fa-spin"></i>',

            // The form instance containing the data to send.
            form: new Form()
        }
    },

    watch: {
        /**
         * Watch the submit permission of the form, to enable or disable the submit button.
         *
         * @param isValid {@code true} if a submit is allowed, {@code false} otherwise.
         */
        valid: function (isValid) {
            window.eventHub.$emit('validate_' + this.callbackName, isValid);
            this.button.prop('disabled', !isValid);
        },
    },

    mounted: function () {
        this.$nextTick(function () {
            if (this.button) {
                this.originalLoadingContent = this.button.html();
            }

            // Disable the submit permission, to let the user make at least one input
            this.updateFormSubmitPermission();
        })
    },

    methods: {

        /**
         * Starts the form submitting process.
         */
        submit: function () {
            if (!this.valid) {
                window.eventHub.$emit('prevented_' + this.callbackName, this);
                return;
            }

            // Let the user confirm his submit action, if a confirm was defined in the properties.
            if (this.showConfirm) {
                showConfirm(
                    this.confirmType,
                    this.confirmTitle,
                    this.confirmMessage,
                    () => {
                        this.startLoader();
                        this.sendData();
                    },
                    null,
                    this.confirmAccept,
                    this.confirmCancel
                );
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
            window.eventHub.$emit('submitting_' + this.callbackName, this);

            this.form.submit(this.submitMethod, this.submitAction)
                .then(response => {
                    this.handleResponse(true, response);
                })
                .catch(error => {
                    this.handleResponse(false, error);
                });
        },

        /**
         * Handles the successful response from the server.
         *
         * @param response The response from the server.
         */
        handleSuccess: function (response) {
            if (this.submitMethod == 'get') {
                updateHrefParamsWithData(this.form.data());
            }

            if (this.appendResponse) {
                appendData(this.appendResponse, response);
            }

            if (this.prependResponse) {
                prependData(this.prependResponse, response);
            }

            if (this.replaceResponse) {
                replaceData(this.replaceResponse, response);
            }

            this.redirectUser();
            this.onSuccess(response);
        },

        /**
         * Handles the response from the server, after the form has been submitted.
         *
         * @param success {@code true} if the submit was successful, {@code false} otherwise.
         * @param response The response from the server.
         */
        handleResponse: function (success, response) {

            // Check the success type, show the corresponding alerts and call the corresponding callback methods.
            if (!success) {
                this.showErrorMessage(response);
                this.onError(response);
            } else {

                if (this.showAlert) {
                    showAlert('success', this.alertTitle, this.alertMessage, this.alertDuration, () => {
                        this.handleSuccess(response);
                    });
                } else {
                    this.handleSuccess(response);
                }
            }

            // Stop the loader only if an error occurred, or if it's not explicitly forbidden (if an loader was set).
            if (this.stopLoading || !success) {
                this.stopLoader();
            }

            this.updateFormSubmitPermission();

            // Call the callback to handle the after submit action directly on the page.
            // The callback has 4 parameters (+ the callback name):
            // - callbackName: The name of the event to listen to for the callback.
            // - success: {@code true} if the request was successful handled on the server, {@code false} otherwise.
            // - response: The response message retrieved from the server.
            // - method: The method that was used to proceed the request.
            // - component: The current instance of this component (useful to extract the form with 'component.$el'
            setTimeout(() => {
                // noinspection JSUnresolvedFunction
                window.eventHub.$emit(this.callbackName, success, response, this.submitMethod, this);
            }, (this.alertError && !success) || this.showAlert ? this.alertDuration : 0);
        },

        /**
         * Redirects the user to the redirect path, if the 'redirect' property is set.
         */
        redirectUser: function () {
            if (this.redirect) {
                window.location.href = this.redirect;
            }
        },

        /**
         * Shows an error message to the user, after the form has been submitted and an error occurred on the server.
         *
         * @param response The error response of the server.
         */
        showErrorMessage: function (response) {
            // Check if an error message shall be shown to the user.
            if (this.showAlert && this.alertError) {
                let msg = null;

                // Extract the error message from the response
                if(response && response.hasOwnProperty('msg')) {
                    msg = response['msg'];
                } else if (response) {
                    for (let key in response) {
                        if(response.hasOwnProperty(key)) {
                            msg = response[key];
                            break;
                        }
                    }
                }

                if (!msg) {
                    msg = this.$t('alert.error.' + this.submitMethod + '.content', {name: this.objectName})
                }

                showAlert('error', this.$t('alert.error.' + this.submitMethod + '.title', {name: this.objectName}), msg, this.alertDuration);
            }
        },

        /**
         * Gets the localization string for an alert type and a type and falls back to the default if necessary.
         *
         * @param alertType 'alert' or 'confirm'
         * @param type 'title', 'content', 'cancel' or 'accept'
         * @param params localization params
         * @returns {string}
         */
        getLocalizationString: function (alertType, type, params = null) {
            let key = alertType + '.' + this.alertKey + '.' + this.submitMethod + '.' + type;
            let defaultKey = alertType + '.default.' + this.submitMethod + '.' + type;
            let text = this.$t(key, params);
            if (key == text) {
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
        onSuccess: function (response) {},

        /**
         * Will be called if an error occurred on the form submit.
         *
         * @param response The response from the server.
         */
        onError: function (response) {},
    }
};

