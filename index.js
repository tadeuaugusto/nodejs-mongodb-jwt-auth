require('dotenv').config(); // setup dotenv as soon as the app starts

const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');

const app = express();
const router = express.Router();

const environment = process.env.NODE_ENV // DEV
const stage = require('./config')[environment];

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

if (environment !== 'production') {
    app.use(logger('dev'));
}

/** routes */
const routes = require('./routes/index.js');

app.use('/api/v1', routes(router));

app.listen(`${stage.port}`, () => {
    console.log(`Server listening at localhost:${stage.port}`);
});

module.exports = app;