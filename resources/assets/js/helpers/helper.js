/***********************************************************
 Vue Forms: Helper
 --------------------------
 Defines helper functions for the vue form components
 ************************************************************/

// Alerts
import Alert from "./Alert";
window.Alert = Alert;

/**
 * Appends data to a wrapper.
 *
 * @param {string} wrapper The selector of the wrapper to append the data.
 * @param {string} data The data to append.
 */
window.appendData = function (wrapper, data) {
    $(wrapper).append(data);
    new Vue({
        el: wrapper
    });
};

/**
 * Prepends data to a wrapper.
 *
 * @param {string} wrapper The selector of the wrapper to prepend the data.
 * @param {string} data The data to prepend.
 */
window.prependData = function (wrapper, data) {
    $(wrapper).prepend(data);
    new Vue({
        el: wrapper
    });
};

/**
 * Replaces an element with new data.
 *
 * @param element
 * @param data
 */
window.replaceData = function (element, data) {
    $(element).replaceWith(data);
    new Vue({
        el: element
    });
};

/**
 * Serializes a data object to a query string.
 *
 * @param data
 * @returns {*}
 */
window.serializeData = function (data) {
    let str = [];

    _.each(data, (value, key) => {
        if (_.isArray(value)) {
            value = value.join(',');
        }
        if (value !== null && value !== undefined && value.length) {
            str.push(encodeURIComponent(key) + "=" + encodeURIComponent(value));
        }
    });

    return str.join("&");
};

/**
 * Updates the window location href with params without reloading the page.
 *
 * @param params
 */
window.updateHrefParams = function (params) {
    let url = window.location.href.split('?')[0];
    history.pushState('', '', url + "?" + params);
};

/**
 * Helper to append a query string of the specified data to the current url.
 *
 * @param data
 */
window.updateHrefParamsWithData = function (data) {
    updateHrefParams(serializeData(data));
};

/**
 * Checks if the specified email address is a valid email address.
 *
 * @param email
 * @returns {boolean}
 */
window.isValidEmail = function (email) {
    return /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(email);
};

/**
 * Gets the child components of the specified vue component.
 *
 * @param vueComponent
 * @returns {Array}
 */
window.getListOfChildren = function (vueComponent) {
    let children = [];
    vueComponent.$children.forEach((child) => {
        children.push(child);
        children = children.concat(getListOfChildren(child));
    });
    return children;
};

/**
 * Gets the parent components of the specified vue component.
 *
 * @param vueComponent
 * @returns {Array}
 */
window.getListOfParents = function (vueComponent) {
    let parents = [];
    let parent = vueComponent.$parent;
    if (parent) {
        parents.push(parent);
        parents = parents.concat(getListOfParents(parent));
    }
    return parents;
};