const config = require('./config');
const vault = require('./vault');

/**
 * Gets the credentials for an app and channel
 * @param {String} app The app name
 * @param {String} channel The channel name
 * @returns {Promise} A promise for the credentials for the app and channel
 */
function getCredentials(app, channel) {
    return new Promise(function (resolve, reject) {
        switch(config.getSecretType()) {
        case config.types.VAULT:
            vault.read(vault.getPath(app, channel))
                .then(resolve)
                .catch(reject);
            break;
        default:
            reject('Could not find a secret source');
        }
    });
}

module.exports = {
    getCredentials: getCredentials
};