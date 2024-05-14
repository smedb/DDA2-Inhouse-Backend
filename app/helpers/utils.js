const camelToSnakeCase = (str) => str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

const objectToSnakeCase = (obj) => {
    const snakeCasedObj = {};
    Object.keys(obj).forEach(key => {
        snakeCasedObj[camelToSnakeCase(key)] = obj[key];
    });
    return snakeCasedObj;
}

const isBetweenRange = (range, value) => {
    const [ minRange, maxRange ] = range.split("-");
    return maxRange ? (value <= maxRange && value >= minRange) : value >= minRange;
}

module.exports = {
    camelToSnakeCase,
    objectToSnakeCase,
    isBetweenRange
}