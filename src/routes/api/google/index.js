const express = require('express');
const router = express.Router();
const get = require('lodash/get');

const secrets = require('../../../lib/secrets');
const filters = require('../../../lib/filters');
const google = require('../../../lib/systems/google');

const APP_NAME = 'google';

router.post('/:channel/:filter', function (req, res, next) {
    const sonar_data = req.body;
    const thread_id_path = [ 'properties', 'sonar.analysis.threadId' ];
    const thread_id = get(sonar_data, thread_id_path);

    secrets.getCredentials(APP_NAME, req.params.channel)
        .then(function (credentials) {
            filters.applyFilter(APP_NAME, req.params.filter, sonar_data)
                .then(function (data) {
                    google.send(credentials, data, thread_id)
                        .then(function () {
                            res.json({
                                status: 'OK'
                            });
                        })
                        .catch(next);
                }).catch(next);
        }).catch(next);
});

module.exports = router;