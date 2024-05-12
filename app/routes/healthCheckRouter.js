const { Router } = require('express');
const { execSync } = require('child_process');
const path = require('path');
const { mapUserQuestionsToMLModel } = require('../helpers/creditScoreHelper');

const routes = Router();

routes.get("/health_check", (req, res) => res.status(200).send("Hello World!"));

// Won't be an endpoint, will be consumed by the create user method once implemented
routes.post('/predict', async (req, res) => {
    const mappedData = mapUserQuestionsToMLModel(req.body);
    const normalizedPath = path.join(__dirname, '.');
    const pythonCommand = `python3 ${normalizedPath}/../../ml-model/predict.py '${JSON.stringify(mappedData)}'`;
    const prediction = parseInt(execSync(pythonCommand).toString().replace('\n',''));
    if( typeof prediction != 'number') {
        // Ver como parsear la db en caso de error
        return res.status(404).send({ message: 'The given data can not be predicted'})
    }
    res.status(200).send({ prediction })
});

module.exports = { healthCheckRouter: routes};