const AWS = require('aws-sdk');
const { getBinaryFromBase64Img } = require('../helpers/utils');
require('dotenv').config();

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'us-east-1'
});

const rekognition = new AWS.Rekognition();

const params = (sourceImage, targetImage) => ({
    SourceImage: {
      Bytes: getBinaryFromBase64Img(sourceImage)
    },
    TargetImage: {
      Bytes: getBinaryFromBase64Img(targetImage)
    },
    SimilarityThreshold: 80
});
 
const compareFaces = (sourceImage, targetImage) =>  
  rekognition.compareFaces(params(sourceImage, targetImage)).promise();


module.exports = {
  compareFaces
}