/***********************************************************
 Vue Forms: Form
 --------------------------
 Defines the way how server requests by the vue forms are handled.
 ************************************************************/

class Form {

    /**
     * Creates a new Form instance.
     *
     * @param {object|null} data
     */
    constructor(data = null) {
        for (let field in data) {
            if (data.hasOwnProperty(field)) {
                this[field] = data[field];
            }
        }
    }

    /**
     * Fetches all relevant data for the form.
     */
    data() {
        let data = {};

        for (let property in this) {
            if (this.hasOwnProperty(property)) {
                if (!isFunction(this[property])) {
                    data[property] = this[property];
                }
            }
        }

        return data;
    }

    /**
     * Sends a POST request to the given URL.
     *
     * @param {string} url
     */
    post(url) {
        return this.submit('post', url);
    }

    /**
     * Sends a PUT request to the given URL.
     *
     * @param {string} url
     */
    put(url) {
        return this.submit('put', url);
    }

    /**
     * Sends a PATCH request to the given URL.
     *
     * @param {string} url
     */
    patch(url) {
        return this.submit('patch', url);
    }

    /**
     * Sends a DELETE request to the given URL.
     *
     * @param {string} url
     */
    delete(url) {
        return this.submit('delete', url);
    }

    /**
     * Submits the form.
     *
     * @param {string} requestType
     * @param {string} url
     */
    submit(requestType, url) {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: requestType.toLowerCase(),
                url: url,
                data: this.data(),
                success: response => {
                    resolve(response);
                },
                error: error => {
                    reject(error.responseJSON);
                }
            });
        });
    }
}

export default Form;



