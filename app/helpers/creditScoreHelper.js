const { predictMLCreditScore } = require('../services/predictCreditScore');
const { CREDIT_SCORE_RANGES } = require('./constants');
const { objectToSnakeCase, isBetweenRange } = require('./utils');

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
    const mappedData = objectToSnakeCase({
                immovables,
                monthlyIncome,
                employmentSituation,
                hasTesla
            });
            console.log(mappedData)
    const prediction = predictMLCreditScore(mappedData);
    console.log("🚀 ~ predictCreditScore ~ prediction:", prediction)
    if( typeof prediction != 'number') {
        throw new Error({ message: 'The given data can not be predicted'})
    }
    return { creditScore: prediction, fraudSituation: calculateFraudSituation(prediction)};
};

module.exports = {
    predictCreditScore,
    calculateFraudSituation
}