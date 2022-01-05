const axios = require('axios');
const isEmpty = require('lodash/isEmpty');

const BASE_URL = 'https://chat.googleapis.com';

/**
 * Gets the url for the space
 * @param {Object} credentials The space credentials
 * @returns {String} The url
 */
function getURL(credentials) {
    const params = [
        `key=${credentials.key}`,
        `token=${credentials.token}`
    ];

    return `${BASE_URL}/v1/spaces/${credentials.space}/messages?${params.join('&')}`;
}

/**
 * Sends a message to a Google chat channel
 * @param {Object} credentials The credentials data
 * @param {Object} data The data
 * @param {String} thread_id The chat thread id (optional)
 * @returns {Promise} A promise for when the message has been sent
 */
function sendMessage(credentials, data, thread_id) {
    return new Promise(function (resolve, reject) {
        const url = getURL(credentials);
        console.log(url);

        if (!isEmpty(thread_id)) {
            data.thread = {
                name: thread_id
            };
        }

        const options = {
            headers: {
                'content-type': 'application/json'
            }
        };

        axios.post(url, data, options)
            .then(resolve)
            .catch(reject);
    });
}

module.exports = {
    send: sendMessage
};