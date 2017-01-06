class Form {

    /**
     * Create a new Form instance.
     *
     * @param {object|null} data
     */
    constructor(data = null) {
        for (let field in data) {
            this[field] = data[field];
        }
    }

    /**
     * Fetch all relevant data for the form.
     */
    data() {
        let data = {};

        for (let property in this) {
            if (!isFunction(this[property])) {
                data[property] = this[property];
            }
        }

        return data;
    }

    /**
     * Send a POST request to the given URL.
     * .
     * @param {string} url
     */
    post(url) {
        return this.submit('post', url);
    }

    /**
     * Send a PUT request to the given URL.
     * .
     * @param {string} url
     */
    put(url) {
        return this.submit('put', url);
    }

    /**
     * Send a PATCH request to the given URL.
     * .
     * @param {string} url
     */
    patch(url) {
        return this.submit('patch', url);
    }

    /**
     * Send a DELETE request to the given URL.
     * .
     * @param {string} url
     */
    delete(url) {
        return this.submit('delete', url);
    }

    /**
     * Submit the form.
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



