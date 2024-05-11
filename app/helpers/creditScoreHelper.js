const { ML_MODEL_VARIABLES } = require('./constants');

/*
    User data example: {
        immovables: '1-2',
        monthly_income: '<500',
        employment_situation: 'employee',
        has_tesla: 'no'
    }
*/
const mapUserQuestionsToMLModel = (userData) => {
    const mappedData = {};
    ML_MODEL_VARIABLES.forEach(attribute => {
            attribute.options.forEach(option => {
                mappedData[`${attribute.key}_${option}`] = userData[attribute.key] == option ? 1 : 0;
            })
    })
    return mappedData;
}

module.exports = {
    mapUserQuestionsToMLModel
}