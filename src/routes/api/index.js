const express = require('express');
const router = express.Router();

const googleRoute = require('./google');
const pkg = require('../../../package.json');

router.get('/', function (req, res) {
    const data = {
        version: pkg.version
    };
    res.json(data);
});

router.use('/google', googleRoute);

module.exports = router;