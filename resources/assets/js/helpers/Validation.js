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
                case 'required_with':
                    this.requiredWith(inputValue, ruleValue).then((result) => {
                        resolve(result);
                    });
                    break;
                case 'required_if':
                    this.requiredIf(inputValue, ruleValue).then((result) => {
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
                case 'phone':
                    this.phone(inputValue).then((result) => {
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
                case 'date':
                    this.date(inputValue).then((result) => {
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
            let valid = _.isNumber(value) || (!_.isNull(value) && !_.isUndefined(value));
            if (_.isString(value)) {
                valid = !!value && value.length;
            }

            resolve({valid: valid, message: valid ? null : `The field is required.`})
        });
    }

    requiredWith(value, additionalInputs) {
        return new Promise((resolve) => {

            if (!value || !value.length) {
                let inputs = _.split(additionalInputs, ',');
                _.each(inputs, input => {
                    let inputEl = $(this.form).find(':input[name="' + input + '"]').first();
                    if (inputEl.length > 0) {
                        resolve({valid: false, message: `The field is required, if ${input} is present.`});
                    }
                });
            }
            resolve({valid: true, message: null})
        });
    }

    requiredIf(value, keyValue) {
        return new Promise((resolve) => {
            let valid = true;

            if (!value || !value.length) {
                let keyValuePair = _.split(keyValue, ',');
                let input = keyValuePair[0];
                let value = keyValuePair[1];
                valid = value == $(this.form).find(':input[name="' + input + '"]').first().val();
                resolve({valid: valid, message: valid ? null : `The field is required, if ${input} is equal to ${value}.`})
            } else {
                resolve({valid: true, message: null})
            }
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
            let input = this.findClosestInput(confirmInputName);

            // Only validate if an input to compare exists on the validated form
            if (input && value) {
                valid = value === input.val();

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

    phone(value) {
        return new Promise((resolve) => {
            let valid = true;
            if (value) {
                valid = /^[0-9 +-]*$/.test(value);
            }
            resolve({valid: valid, message: valid ? null : `Please enter a valid phone number.`})
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

    date(value) {
        return new Promise((resolve) => {
            let valid = value ? moment(value).isValid() : true;
            resolve({valid: valid, message: valid ? null : `Please enter a valid date.`})
        });
    }

    after(value, comparisonDateInputName) {
        return new Promise((resolve) => {
            let valid = true;
            let comparisonValue = this.parseComparisonInputValue(comparisonDateInputName);

            // Only validate if a value to compare exists on the validated form
            if (comparisonValue) {
                let dateValue = moment(value);

                if (dateValue.isValid()) {
                    valid = dateValue.isAfter(comparisonValue);
                }
            }

            resolve({valid: valid, message: valid ? null : `The date must be after ${comparisonDateInputName}.`})
        });
    }

    before(value, comparisonDateInputName) {
        return new Promise((resolve) => {
            let valid = true;
            let comparisonValue = this.parseComparisonInputValue(comparisonDateInputName);

            // Only validate if a value to compare exists on the validated form
            if (comparisonValue) {
                let dateValue = moment(value);

                if (dateValue.isValid()) {
                    valid = dateValue.isBefore(comparisonValue);
                }
            }

            resolve({valid: valid, message: valid ? null : `The date must be before ${comparisonDateInputName}.`})
        });
    }

    same(value, comparisonDateInputName) {
        return new Promise((resolve) => {
            let valid = true;
            let comparisonValue = this.parseComparisonInputValue(comparisonDateInputName);

            // Only validate if a value to compare exists on the validated form
            if (comparisonValue) {
                let dateValue = moment(value);

                if (dateValue.isValid()) {
                    valid = dateValue.isSame(comparisonValue);
                }
            }

            resolve({valid: valid, message: valid ? null : `The date must be the same as ${comparisonDateInputName}.`})
        });
    }

    /**
     * Tries to find the closest input with the specified name on the validated form.
     *
     * @param inputName
     */
    findClosestInput(inputName) {

        let selector = ':input[name="' + inputName + '"]';

        // Check if a wildcard is included in the input name. If so, we just use the part after the wildcard to find the input
        if (inputName.indexOf('*') > -1) {
            inputName = inputName.substring(inputName.lastIndexOf('*') + 1, inputName.length); // Make sure we split at the last occurrence of a wildcard
            selector = ':input[name$="' + inputName + '"]'; // Retrieve the input whose name ends with our calculated input name
        }

        let input = $(this.form).find(selector).first();

        return input.length ? input : null;
    }

    /**
     * Tries to find the value for the specified input name. Can also be a date.
     *
     * @param inputName
     */
    parseComparisonInputValue(inputName) {

        // Check if an input with the name exists on the validated form. If so, we retrieve its value.
        let input = this.findClosestInput(inputName);
        if (input) {
            return input.val();
        }

        // Check if the input name represents the today's date
        if (['now', 'today'].indexOf(inputName) > -1) {
            return moment();
        }

        // Check if the input name represents the yesterday's date
        if (['yesterday'].indexOf(inputName) > -1) {
            return moment().subtract(1, 'days');
        }

        // Check if the input name represents the tomorrow's date
        if (['tomorrow'].indexOf(inputName) > -1) {
            return moment().add(1, 'days');
        }

        // Check if the input represents any date
        let dateValue = moment(inputName);
        if (dateValue.isValid()) {
            return dateValue;
        }

        return null;
    }

}

export default Validation;



