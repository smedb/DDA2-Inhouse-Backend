const AWS = require('aws-sdk');
const axios = require('axios');
require('dotenv').config();

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'us-east-1'
});

const getImageBufferFromUrl = async (imageUrl) => {
  const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
  return Buffer.from(response.data, 'binary');
};

const rekognition = new AWS.Rekognition();

const params = async (sourceImage, targetImage) => ({
    SourceImage: {
      Bytes: await getImageBufferFromUrl(sourceImage)
    },
    TargetImage: {
      Bytes: await getImageBufferFromUrl(targetImage)
    },
    SimilarityThreshold: 80
});
 
const compareFaces = async (sourceImage, targetImage) =>  
  rekognition.compareFaces(await params(sourceImage, targetImage)).promise();


module.exports = {
  compareFaces
}