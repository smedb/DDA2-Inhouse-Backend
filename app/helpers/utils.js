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

const getBinaryFromBase64Img = (image) => {
    const splitString = image.includes('image/png') ? "data:image/png;base64," : "data:image/jpg;base64,"
    var base64Image = image.split(splitString)[1];
    var binaryString = atob(base64Image);
      var bytes = new Uint8Array(binaryString.length);
      for (var i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
      }
      return bytes.buffer;
  }

module.exports = {
    camelToSnakeCase,
    objectToSnakeCase,
    isBetweenRange,
    getBinaryFromBase64Img
}