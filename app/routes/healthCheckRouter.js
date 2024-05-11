const { Router } = require('express');
const { execSync } = require('child_process');
const path = require('path');
const { mapUserQuestionsToMLModel } = require('../helpers/creditScoreHelper');

const routes = Router();

routes.get("/health_check", (req, res) => res.status(200).send("Hello World!"));

routes.post('/predict', async (req, res) => {
    const mappedData = mapUserQuestionsToMLModel(req.body);
    const normalizedPath = path.join(__dirname, '.');
    const pythonCommand = `python3 ${normalizedPath}/../../ml-model/predict.py '${JSON.stringify(mappedData)}'`;
    const prediction = parseInt(execSync(pythonCommand).toString().replace('\n',''));
    // validar que sea un numero, sino guardarlo con error o ver que hacer en la db
    res.status(200).send({ prediction })
});

module.exports = { healthCheckRouter: routes};