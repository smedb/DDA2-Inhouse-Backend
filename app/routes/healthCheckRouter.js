const { Router } = require('express')

const routes = Router();

routes.get("/health_check", (req, res) => res.status(200).send("Hello World!"));

module.exports = { healthCheckRouter: routes};