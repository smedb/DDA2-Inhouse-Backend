const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./app/routes/index');
const cors = require("cors");
require('dotenv').config();

const {
    DB_URL,
} = process.env;

const mongoose = require('mongoose');

const app = express();

let corsOptions = {
    origin: '*'
};

app.use(cors(corsOptions));

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

mongoose.connect(DB_URL).then(() => console.log("Connected to mongo DB")) // TODO: Unncomment once having Mongo up and credentials added to env file

routes.init(app);

module.exports = app;
