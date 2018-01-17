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
                case 'required_if':
                    this.requiredIf(inputValue).then((result) => {
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
                case 'url':
                    this.url(inputValue).then((result) => {
                        resolve(result);
                    });
                    break;
                case 'accepted':
                    this.accepted(inputValue).then((result) => {
                        resolve(result);
                    });
                    break;
                case 'after':
                    this.after(inputValue, ruleValue).then((result) => {
                        resolve(result);
                    });
                    break;
                case 'before':
                    this.before(inputValue, ruleValue).then((result) => {
                        resolve(result);
                    });
                    break;
                case 'same':
                    this.same(inputValue, ruleValue).then((result) => {
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
            let valid = !!value && value.length;
            resolve({valid: valid, message: valid ? null : `The field is required.`})
        });
    }

    requiredIf(value) {
        return new Promise((resolve) => {
            let valid = true;

            if (!value && !value.length) {
                let splits = _.split(value, ',');
                valid = splits[1] === $(this.form).find(':input[name="' + value[0] + '"]').first().val() && (!!value && value.length);
            }

            resolve({valid: valid, message: valid ? null : `The field is required.`})
        });
    }

    min(value, min) {
        return new Promise((resolve) => {
            let valid = true;
            if (value) {
                valid = value.length >= min;
            }
            resolve({valid: valid, message: valid ? null : `Please enter at least ${min} characters.`})
        });
    }

    max(value, max) {
        return new Promise((resolve) => {
            let valid = true;
            if (value) {
                valid = value.length <= max;
            }
            resolve({valid: valid, message: valid ? null : `The input may not be greater than ${max} characters.`})
        });
    }

    confirmed(value, confirmInputName) {
        return new Promise((resolve) => {
            let valid = true;
            if (value) {
                valid = value === $(this.form).find(':input[name="' + confirmInputName + '"]').first().val();
            }
            resolve({valid: valid, message: valid ? null : `The confirmation does not match.`})
        });
    }

    email(value) {
        return new Promise((resolve) => {
            let valid = true;
            if (value) {
                valid = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(value);
            }
            resolve({valid: valid, message: valid ? null : `Please enter a valid email address.`})
        });
    }

    accepted(value) {
        return new Promise((resolve) => {
            let valid = value === 'on' || value === 'true' || value === 1 || value === true;
            resolve({valid: valid, message: valid ? null : `This must be accepted.`})
        });
    }

    url(value) {
        return new Promise((resolve) => {
            let valid = true;
            if (value) {
                valid = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/.test(value);
            }
            resolve({valid: valid, message: valid ? null : `Please enter a valid url.`})
        });
    }

    after(value, comparisonDateInputName) {
        return new Promise((resolve) => {
            let valid = true;
            let comparisonDateValue = moment($(this.form).find(':input[name="' + comparisonDateInputName + '"]').first().val());
            let dateValue = moment(value);

            if (comparisonDateValue.isValid() && dateValue.isValid()) {
                valid = dateValue.isAfter(comparisonDateValue);
            }

            resolve({valid: valid, message: valid ? null : `The date must be after ${comparisonDateInputName}.`})
        });
    }

    before(value, comparisonDateInputName) {
        return new Promise((resolve) => {
            let valid = true;
            let comparisonDateValue = moment($(this.form).find(':input[name="' + comparisonDateInputName + '"]').first().val());
            let dateValue = moment(value);

            if (comparisonDateValue.isValid() && dateValue.isValid()) {
                valid = dateValue.isBefore(comparisonDateValue);
            }

            resolve({valid: valid, message: valid ? null : `The date must be before ${comparisonDateInputName}.`})
        });
    }

    same(value, comparisonDateInputName) {
        return new Promise((resolve) => {
            let valid = true;
            let comparisonDateValue = moment($(this.form).find(':input[name="' + comparisonDateInputName + '"]').first().val());
            let dateValue = moment(value);

            if (comparisonDateValue.isValid() && dateValue.isValid()) {
                valid = dateValue.isSame(comparisonDateValue);
            }

            resolve({valid: valid, message: valid ? null : `The date must be the same as ${comparisonDateInputName}.`})
        });
    }

}

export default Validation;



