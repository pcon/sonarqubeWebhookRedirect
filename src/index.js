const express = require('express');

const apiRouter = require('./routes/api');

const app = express();
app.set('view engine', 'ejs');
app.use(express.json());

app.use('/api', apiRouter);

app.use(function (error, request, response, next) {
    if (response.headersSent) {
        return next(error);
    }

    //console.log(error);

    response
        .status(500)
        .json({
            message: error.message
        });
});

module.exports = app;