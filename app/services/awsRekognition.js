const AWS = require('aws-sdk');
require('dotenv').config();

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'us-east-1'
});

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
 
const compareFaces = (sourceImage, targetImage) =>  
  rekognition.compareFaces(params(sourceImage, targetImage)).promise();


module.exports = {
  compareFaces
}