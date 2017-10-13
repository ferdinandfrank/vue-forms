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
 * Checks if the specified param is a callable js function.
 *
 * @param functionToCheck
 * @returns {boolean}
 */
window.isFunction = function (functionToCheck) {
    return typeof functionToCheck === 'function';
};

/**
 * Replaces a char of a string with a substring.
 *
 * @param {string} s The string where to replace a char.
 * @param {int} n The char index that shall be replaced.
 * @param {string} t The substring that shall be inserted.
 * @returns {string}
 */
window.replaceChar = function (s, n, t) {
    return s.substring(0, n) + t + s.substring(n + 1);
};

/**
 * Serializes a data object to a query string.
 *
 * @param data
 * @returns {*}
 */
window.serializeData = function (data) {
    let str = [];
    for (let key in data)
        if (data.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key) + "=" + encodeURIComponent(data[key]));
        }
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
    return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email);
};

window.titleCase = function (str) {
    let splitStr = str.toLowerCase().split(' ');
    for (let i = 0; i < splitStr.length; i++) {
        // You do not need to check if i is larger than splitStr length, as your for does that for you
        // Assign it back to the array
        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    // Directly return the joined string
    return splitStr.join(' ');
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