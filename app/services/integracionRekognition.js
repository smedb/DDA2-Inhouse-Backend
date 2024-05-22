const AWS = require('aws-sdk');
require('dotenv').config();

var credentials = new AWS.SharedIniFileCredentials({profile: 'default'});
AWS.config.credentials = credentials;
AWS.config.credentials.sessionToken=process.env.AWS_SESSION_TOKEN;
AWS.config.update({region: 'us-east-1'});
const rekognition = new AWS.Rekognition();

const getBinary = (image) => {
  const splitString = image.includes('image/png') ? "data:image/png;base64," : "data:image/jpg;base64,"
  var base64Image = image.split(splitString)[1];
  var binaryString = atob(base64Image);
    var bytes = new Uint8Array(binaryString.length);
    for (var i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
}

const params = (sourceImage, targetImage) => ({
    SourceImage: {
      Bytes: getBinary(sourceImage)
    },
    TargetImage: {
      Bytes: getBinary(targetImage)
    },
    SimilarityThreshold: 80
});
 
const compareFaces = async (sourceImage, targetImage) =>  
  await rekognition.compareFaces(params(sourceImage, targetImage)).promise();


module.exports = {
  compareFaces
}