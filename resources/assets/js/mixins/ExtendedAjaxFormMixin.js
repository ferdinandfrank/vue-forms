/**
 *  Ajax Form Mixin for ajax forms, which have inputs and a submit button as part of their content.
 */

import ajaxFormMixin from "./AjaxFormMixin";
import removeElementMixin from "./RemoveElementMixin";

module.exports = {

    mixins: [ajaxFormMixin, removeElementMixin],

    props: {

        // Set to true, if the form's inputs shall be cleared after the submit.
        clear: {
            type: Boolean,
            default: false
        },

        // Set to true, if the form's inputs shall be reset after the submit.
        reset: {
            type: Boolean,
            default: false
        },

        // If the form is used to create a new entity, this property is used to extract the route key of the created entity
        // and append it on the updateAction property, so a full update url for the entity will be created and the future
        // submit can successfully be treated as an update for the entity.
        objectKey: {
            type: String,
            default: 'id'
        },

        // The link to the details page of the created or edited entity to redirect the user after the form was successfully submitted.
        // If this property is not set, no redirect will occur.
        // Important: Because the key of the entity isn't known before its creation, set the objectKey property to the route key
        // of the entities model, so the key can be extracted from the response and the full update url for the entity can be created.
        detailRedirect: {
            type: String
        }
    },

    methods: {

        /**
         * Will be called if the form has been successfully submitted.
         *
         * @param response The response from the server.
         */
        onSuccess: function (response) {

            let redirectURL = this.detailRedirect;
            if (redirectURL) {
                // Get the created key for the entity
                if (this.objectKey) {
                    let objectKey = response[this.objectKey];
                    if (!redirectURL.endsWith(objectKey)) {
                        if (!redirectURL.endsWith('/')) {
                            redirectURL += '/';
                        }
                        redirectURL += objectKey;
                    }
                }

                window.location.href = redirectURL;
            }

            // Clear the form inputs
            if (this.clear) {
                this.clearInputs();
            }

            // Reset the form inputs
            if (this.reset) {
                this.resetInputs();
            }

            this.removeElement();
        },

        /**
         * Will be called if an error occurred on the form submit.
         *
         * @param errors The errors from the server.
         */
        onError: function (errors) {
            for (let errorKey in errors) {
                this.addErrorToInputComponent(this.getChildInputComponentByName(errorKey), errors[errorKey][0])
            }
        },

        /**
         * Adds the specified error message to the input field of the specified input component.
         *
         * @param inputComponent
         * @param errorMsg
         */
        addErrorToInputComponent: function (inputComponent, errorMsg) {
            if (inputComponent && isFunction(inputComponent.addError)) {
                inputComponent.addError(errorMsg);
            }
        },

        /**
         * Clears the values of the child input component's.
         */
        clearInputs: function () {
            let children = getListOfChildren(this);
            for (let index in children) {
                let child = children[index];
                if (isFunction(child.clear)) {
                    child.clear();
                }
            }
        },

        /**
         * Resets the values of the child input component's.
         */
        resetInputs: function () {
            let children = getListOfChildren(this);
            for (let index in children) {
                let child = children[index];
                if (isFunction(child.reset)) {
                    child.reset();
                }
            }
        },

        /**
         * Gets the child input component of the form, that has an input with the specified name, if it exists.
         *
         * @param inputName
         * @returns {*}
         */
        getChildInputComponentByName: function (inputName) {
            let childInputComponent = null;

            let children = getListOfChildren(this);
            for (let index in children) {
                let child = children[index];
                if (child.hasOwnProperty("name") && child.name == inputName) {
                    childInputComponent = child;
                }
            }

            return childInputComponent;
        },
    }
};

