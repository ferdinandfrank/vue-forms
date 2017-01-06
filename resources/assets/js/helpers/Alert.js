class Alert {

    constructor(type, title, message) {
        this.type = type;
        this.message = message;
        this.title = title;
    }

    show(timer = 3000) {
        let showConfirmButton = false;
        if (this.type == 'error') {
            timer = null;
            showConfirmButton = true;
        }

        $('.sweet-alert, .sweet-overlay').remove();

        swal({
            title: this.title,
            text: this.message,
            type: this.type,
            timer: timer,
            html: true,
            showConfirmButton: showConfirmButton
        });
    }

    confirm(confirmAction, cancelAction, buttonText, cancelButtonText) {

        let showCancelButton = true;
        if (this.type == "error") {
            buttonText = "Ok";
        }
        if (cancelButtonText == false || this.type == "error") {
            showCancelButton = false;
        }

        swal({
            title: this.title,
            text: this.message,
            type: this.type,
            html: true,
            confirmButtonText: buttonText,
            showCancelButton: showCancelButton,
            cancelButtonText: cancelButtonText,
        }, function(isConfirm){
            if (isConfirm) {
                if (confirmAction) {
                    confirmAction.call();
                } else {
                    swal.close();
                }
            } else {
                if (cancelAction) {
                    cancelAction.call();
                } else {
                    swal.close();
                }
            }
        });
    }

}

export default Alert;



