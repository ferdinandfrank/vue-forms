/***********************************************************
 Vue Forms: Alert
 --------------------------
 Defines the way how alert messages produced by the vue forms are shown.
 ************************************************************/

class Alert {

    /**
     * Creates a new Alert instance with the specified message and title.
     *
     * @param message The message to show on the alert
     * @param title The title to show on the alert
     * @param type Can be 'success', 'info', 'warning', 'error' or ''
     */
    constructor(message, title = '', type = '') {
        this.type = type;
        this.message = message;
        this.title = title;
        this.dangerMode = type === 'error' || type === 'warning';
    }

    /**
     * Shows a simple self-disappearing alert message. Does not automatically disappear if a button text is set.
     *
     * @param buttonText
     * @param timer
     * @returns {Promise}
     */
    show(buttonText = false, timer = 3000) {
        if (this.type === 'error') {
            timer = null;
            buttonText = "Ok";
        }

        return new Promise((resolve) => {
            swal({
                title: this.title,
                text: this.message,
                icon: this.type,
                dangerMode: this.dangerMode,
                timer: timer,
                button: buttonText
            }).then(() => {
                resolve();
            });
        });
    }

    /**
     * Shows a confirm alert with the specified confirm and cancel button texts.
     *
     * @param buttonText
     * @param cancelButtonText
     */
    confirm(buttonText = true, cancelButtonText = true) {
        return new Promise((resolve) => {
            swal({
                title: this.title,
                text: this.message,
                icon: this.type,
                dangerMode: this.dangerMode,
                buttons: [cancelButtonText, buttonText],
            }).then((value) => {
                swal.close();
                resolve(value);
            });
        });
    }

    /**
     * Shows an input alert with the specified confirm and cancel button texts.
     *
     * @param buttonText
     * @param cancelButtonText
     * @param placeholder
     * @param type
     * @param value
     */
    ask(buttonText = true, cancelButtonText = true, placeholder = null, type = "text", value = null) {
        return new Promise((resolve) => {
            swal({
                title: this.title,
                text: this.message,
                icon: this.type,
                content: {
                    element: "input",
                    attributes: {
                        placeholder: placeholder,
                        value: value,
                        type: type
                    }
                },
                dangerMode: this.dangerMode,
                buttons: [cancelButtonText, buttonText],
            }).then((value) => {
                swal.close();
                resolve(value);
            });
        });
    }

    /**
     * Shows a select input alert with the specified options, confirm and cancel button texts.
     *
     * @param options
     * @param buttonText
     * @param cancelButtonText
     * @param value
     * @param placeholder
     */
    select(options, buttonText = true, cancelButtonText = true, value = null, placeholder = null) {
        let selectElement = document.createElement("select");
        selectElement.className = "form-control";

        if (placeholder !== null) {
            let option = document.createElement("option");
            option.value = '';
            option.selected = true;
            option.disabled = true;
            option.text = placeholder;
            selectElement.appendChild(option);
        }

        for (let key in options) {
            if (options.hasOwnProperty(key)) {
                let option = document.createElement("option");
                option.value = key;
                option.text = options[key];
                if (key === value) {
                    option.selected = true;
                    swal.setActionValue(key);
                }

                selectElement.appendChild(option);
            }
        }

        selectElement.addEventListener("change", function () {
            swal.setActionValue(selectElement.value);
        });

        return new Promise((resolve) => {
            swal({
                title: this.title,
                text: this.message,
                icon: this.type,
                content: selectElement,
                dangerMode: this.dangerMode,
                buttons: [cancelButtonText, buttonText],
            }).then((value) => {
                swal.close();
                resolve(value);
            });
        });
    }

    /**
     * Shows a confirm alert with the specified confirm and cancel button texts.
     * If the confirm button is clicked, an ajax request to the specified url with the specified method and data will be sent.
     *
     * @param url
     * @param method
     * @param data
     * @param buttonText
     * @param cancelButtonText
     */
    send(url, method, data, buttonText = 'Ok', cancelButtonText = true) {
        return new Promise((resolve, reject) => {
            swal({
                title: this.title,
                text: this.message,
                icon: this.type,
                dangerMode: this.dangerMode,
                buttons: {
                    cancel: cancelButtonText,
                    confirm: {
                        text: buttonText,
                        closeModal: false
                    }
                },
            }).then((value) => {
                if (value) {
                    $.ajax({
                        type: method.toLowerCase(),
                        url: url,
                        data: data,
                        success: response => {
                            this.showAlert(response, true).then(() => {
                                resolve(response);
                            });
                        },
                        error: error => {
                            this.showAlert(error.responseJSON, false).then(() => {
                                reject(error.responseJSON);
                            });
                        }
                    }).always(() => {
                        swal.stopLoading();
                    });
                } else {
                    swal.close();
                    reject(value);
                }
            });
        });
    }

    /**
     * Shows an alert based on the specified server response and success field.
     *
     * @param response
     * @param success
     * @returns {Promise}
     */
    showAlert(response, success = true) {
        return new Promise((resolve) => {
            let serverKeys = {
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
            };

            let message = null;
            let title = '';
            let accept = false;
            let duration = 3000;

            if (response && response.hasOwnProperty(serverKeys.showAlert) && response[serverKeys.showAlert].hasOwnProperty(serverKeys.alert.message)) {
                let alertInfo = response[serverKeys.showAlert];

                message = alertInfo[serverKeys.alert.message];
                if (alertInfo.hasOwnProperty(serverKeys.alert.title)) {
                    title = alertInfo[serverKeys.alert.title];
                }
                if (alertInfo.hasOwnProperty(serverKeys.alert.accept)) {
                    accept = alertInfo[serverKeys.alert.accept];
                }
                if (alertInfo.hasOwnProperty(serverKeys.alert.duration)) {
                    duration = alertInfo[serverKeys.alert.duration];
                }
            } else if (!success) {
                title = 'Sorry!';
                message = 'An unknown error occurred! Please try again later.';
                accept = 'Ok!';

                // Check for Laravel >= 5.5 validation errors
                if (response && response.hasOwnProperty('errors')) {

                    // Get the first validation error to show on the alert
                    message = response.errors[Object.keys(response.errors)[0]];

                    // Check for custom error message from server
                } else if (response && response.hasOwnProperty(this.serverKeys.error)) {
                    message = response[this.serverKeys.error];

                    // Check for Laravel HTTP Exception error message
                } else if (response && response.hasOwnProperty('message')) {
                    message = response['message'];
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
    }

}

export default Alert;



