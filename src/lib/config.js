const isEmpty = require('lodash/isEmpty');

const VAULT = 'vault';
const UNSET = 'unset';

const HASHICORP_CONFIG_INIT = {
    apiVersion: 'v1',
    endpoint: process.env.HASHICORP_ENDPOINT
};

const HASHICORP_CONFIG_LOGIN = {
    role_id: process.env.HASHICORP_ROLE_ID,
    secret_id: process.env.HASHICORP_SECRET_ID
};

const HASHICORP_CONFIG_ROOT_PATH = process.env.HASHICORP_ROOT_PATH;

/**
 * Gets the secret type
 * @returns {String} How the secrets are stored
 */
function getSecretType() {
    if (!isEmpty(process.env.HASHICORP_ENDPOINT)) {
        return VAULT;
    }

    return UNSET;
}

module.exports = {
    getSecretType: getSecretType,
    vault: {
        init: HASHICORP_CONFIG_INIT,
        login: HASHICORP_CONFIG_LOGIN,
        root_path: HASHICORP_CONFIG_ROOT_PATH
    },
    types: {
        VAULT: VAULT,
        UNSET: UNSET
    }
};