/***********************************************************
 Vue Forms: Validation
 --------------------------
 Defines the available validation rules.
 ************************************************************/

class Validation {

    /**
     * Creates a new Validation instance for the specified form element.
     *
     * @param form The form element to validate.
     */
    constructor(form) {
        this.form = form;
    }

    check(name, rule, inputValue, ruleValue = null) {
        return new Promise((resolve) => {
            switch (rule) {
                case 'required':
                    this.required(inputValue).then((result) => {
                        resolve(result);
                    });
                    break;
                case 'min':
                    this.min(inputValue, ruleValue).then((result) => {
                        resolve(result);
                    });
                    break;
                case 'max':
                    this.max(inputValue, ruleValue).then((result) => {
                        resolve(result);
                    });
                    break;
                case 'confirmed':
                    this.confirmed(inputValue, ruleValue).then((result) => {
                        resolve(result);
                    });
                    break;
                case 'email':
                    this.email(inputValue).then((result) => {
                        resolve(result);
                    });
                    break;
                case 'custom':
                    if (_.isFunction(ruleValue)) {
                        ruleValue(name, inputValue, (valid, message = null) => {
                            resolve({valid: valid, message: message});
                        });
                    }
                    break;
                default:
                    resolve(true);
                    break;
            }
        });
    }

    required(value) {
        return new Promise((resolve) => {
            let valid = !!value;
            resolve({valid: valid, message: valid ? null : `The field is required.`})
        });
    }

    min(value, min) {
        return new Promise((resolve) => {
            let valid = (value ? value.length : 0) >= min;
            resolve({valid: valid, message: valid ? null : `Please enter at least ${value} characters.`})
        });
    }

    max(value, max) {
        return new Promise((resolve) => {
            let valid = (value ? value.length : 0) <= max;
            resolve({valid: valid, message: valid ? null : `The input may not be greater than ${value} characters.`})
        });
    }

    confirmed(value, confirmInputName) {
        return new Promise((resolve) => {
            let valid = value === $(this.form).find(':input[name=' + confirmInputName + ']').first().val();
            resolve({valid: valid, message: valid ? null : `The confirmation does not match.`})
        });
    }

    email(value) {
        return new Promise((resolve) => {
            let valid = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(value);
            resolve({valid: valid, message: valid ? null : `Please enter a valid email address.`})
        });
    }

}

export default Validation;



