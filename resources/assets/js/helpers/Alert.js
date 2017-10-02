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

}

export default Alert;



