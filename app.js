const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./app/routes/index');
const cors = require("cors");
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./docs/swagger.json')
require('dotenv').config();

const DB_URL = process.env.NODE_ENV != 'test' ? process.env.DB_URL : 'mongodb://localhost:27017/mydatabase';

const mongoose = require('mongoose');

const app = express();

let corsOptions = {
    origin: '*'
};

app.use(cors(corsOptions));

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

mongoose.connect(DB_URL).then(() => console.log("Connected to mongo DB"))

routes.init(app);

module.exports = app;
