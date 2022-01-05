const fs = require('fs');
const path = require('path');
const commander = require('commander');
const jsonata = require('jsonata');

/**
 * Checks to make sure the value is only letters
 * @param {String} value The value
 * @returns {String} The value
 */
function onlyLetters(value) {
    if (!/^[a-z_-]+$/.test(value.toLowerCase())) {
        throw new commander.InvalidArgumentError('Name can only contain letters, dash or underscore');
    }

    return value.toLowerCase();
}

/**
 * Checks file access
 * @param {String} filename The filename
 * @returns {Promise} A promise for the filename if access is allowed
 */
function checkFileAccess(filename) {
    return new Promise(function (resolve, reject) {
        fs.access(
            filename,
            fs.constants.F_OK | fs.constants.R_OK,
            function (error) {
                if (error) {
                    reject(error);
                } else {
                    resolve(filename);
                }
            }
        );
    });
}

/**
 * Reads a file from disk
 * @param {String} filename The filename
 * @returns {Promise} A promise for the file contents
 */
function readFile(filename) {
    return new Promise(function (resolve, reject) {
        fs.readFile(filename, function (error, data) {
            if (error) {
                reject(error);
            } else {
                resolve(data);
            }
        });
    });
}

/**
 * Loads the file from disk
 * @param {String} filename The filename
 * @param {Function} resolve The resolve function
 * @param {Function} reject The reject function
 * @returns {undefined}
 */
function loadFile(filename, resolve, reject) {
    checkFileAccess(filename)
        .then(readFile)
        .then(resolve)
        .catch(reject);
}

/**
 * Loads the filter from disk
 * @returns {Promise} a promise for the filter contents
 */
function loadFilter() {
    return new Promise(function (resolve, reject) {
        const dest = program.opts().dest;
        const filter = program.opts().filter;
        const filename = path.join(
            __dirname,
            '../../src/filters',
            dest,
            `${filter}.txt`
        );

        loadFile(filename, resolve, reject);
    });
}

/**
 * Loads the JSON data to filter
 * @param {*} filter_data The filter data
 * @returns {Promise} A promise for the filter and json data
 */
function loadJSON(filter_data) {
    return new Promise(function (resolve, reject) {
        const source = program.opts().source;
        const filename = path.join(
            __dirname,
            '../json/',
            `${source}.json`
        );

        loadFile(
            filename,
            function (json_data) {
                resolve([ filter_data, json_data ]);
            },
            reject
        );
    });
}

/**
 * Filters the data
 * @param {String} filter_data The filter data
 * @param {String} json_data The JSON data
 * @returns {Promise} A promise for the filtered data
 */
function filter([ filter_data, json_data ]) {
    return new Promise(function (resolve) {
        const expression = jsonata(filter_data.toString());
        console.log(
            JSON.stringify(
                expression.evaluate(
                    JSON.parse(
                        json_data.toString()
                    )
                )
            )
        );

        resolve();
    });
}

const program = new commander.Command();
program
    .requiredOption('-s, --source <source>', 'The source JSON file', onlyLetters)
    .requiredOption('-d, --dest <destination>', 'The destination system', onlyLetters, 'google')
    .requiredOption('-f, --filter <filter>', 'The filter to use', onlyLetters);
program.parse();

loadFilter()
    .then(loadJSON)
    .then(filter)
    .catch(console.error);