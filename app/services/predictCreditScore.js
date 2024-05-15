const path = require('path');
const { execSync } = require('child_process');

const predictMLCreditScore = (mappedData) => {
    const normalizedPath = path.join(__dirname, '.');
    const pythonCommand = `python3 ${normalizedPath}/../../ml-model/predict.py '${JSON.stringify(mappedData)}'`;
    return parseInt(execSync(pythonCommand, { shell: false }).toString().replace('\n',''));
};

module.exports = {
    predictMLCreditScore
}