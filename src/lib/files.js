const fs = require('fs');

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

module.exports = {
    loadFile: loadFile
};