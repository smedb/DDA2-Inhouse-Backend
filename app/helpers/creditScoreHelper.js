const { execSync } = require('child_process');
const path = require('path');
const { ML_MODEL_VARIABLES, CREDIT_SCORE_RANGES } = require('./constants');
const { objectToSnakeCase, isBetweenRange } = require('./utils');

const mapUserQuestionsToMLModel = (userData) => {
    const mappedData = {};
    ML_MODEL_VARIABLES.forEach(attribute => {
            attribute.options.forEach(option => {
                mappedData[`${attribute.key}_${option}`] = userData[attribute.key] == option ? 1 : 0;
            })
    })
    return mappedData;
}

const calculateFraudSituation = (creditScore) => {
    let fraudSituation;
    Object.keys(CREDIT_SCORE_RANGES).forEach(range => {
        if(isBetweenRange(range, creditScore)) {
            fraudSituation = CREDIT_SCORE_RANGES[range];
        }
    });
    return fraudSituation;
}

const predictCreditScore = (userData) => {
    const { immovables, monthlyIncome, employmentSituation, hasTesla } = userData;
    const mappedData = mapUserQuestionsToMLModel(
        objectToSnakeCase({
            immovables,
            monthlyIncome,
            employmentSituation,
            hasTesla
        }));
    const normalizedPath = path.join(__dirname, '.');
    const pythonCommand = `python3 ${normalizedPath}/../../ml-model/predict.py '${JSON.stringify(mappedData)}'`;
    const prediction = parseInt(execSync(pythonCommand).toString().replace('\n',''));
    if( typeof prediction != 'number') {
        // Ver como parsear la db en caso de error
        throw new Error({ message: 'The given data can not be predicted'})
    }
    return { creditScore: prediction, fraudSituation: calculateFraudSituation(prediction)};
};

module.exports = {
    predictCreditScore,
    mapUserQuestionsToMLModel
}