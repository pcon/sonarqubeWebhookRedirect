const config = require('./config');
const vault = require('node-vault')(config.vault.init);
const path = require('path');

/**
 * Gets the vault path for an app and channel
 * @param {String} app The app name
 * @param {String} channel The channel name
 * @returns {String} The vault path
 */
function getPath(app, channel) {
    return path.join(config.vault.root_path, app, channel);
}

/**
 * Reads the vault path
 * @param {String} path The vault path
 * @returns {Object} The values
 */
function read(path) {
    return new Promise(function (resolve, reject) {
        vault.approleLogin(config.vault.login)
            .then(function () {
                vault.read(path)
                    .then(function (result) {
                        resolve(result.data.data);
                    }).catch(reject);
            }).catch(reject);
    });
}

module.exports = {
    getPath: getPath,
    read: read
};