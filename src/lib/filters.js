const path = require('path');
const jsonata = require('jsonata');

const files = require('./files');

/**
 * Gets the filter from disk
 * @param {String} app The app name
 * @param {String} filter The filter name
 * @returns {Promise} A promise for the filter
 */
function getFilter(app, filter) {
    return new Promise(function (resolve, reject) {
        const filename = path.join(
            __dirname,
            '../../src/filters',
            app,
            `${filter}.txt`
        );

        files.loadFile(filename, resolve, reject);
    });
}

/**
 * Applies a filter to the data
 * @param {String} app The app name
 * @param {String} filter The filter name
 * @param {Object} data The data to filter
 * @returns {Promise} A promise for the filtered data
 */
function applyFilter(app, filter, data) {
    return new Promise(function (resolve, reject) {
        getFilter(app, filter)
            .then(function (filter_data) {
                const expression = jsonata(filter_data.toString());

                resolve(expression.evaluate(data));
            })
            .catch(reject);
    });
}

module.exports = {
    applyFilter: applyFilter,
    getFilter: getFilter
};