const AWS = require('aws-sdk');

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region:process.env.AWS_REGION

});
// AWS.config.update({region: process.env.AWS_REGION});
const rekognition = new AWS.Rekognition();

const params = (sourceImage, targetImage) => ({
    SourceImage: {
      Bytes: sourceImage,
      // S3Object: {
      //   Bucket: process.env.AWS_BUCKET_NAME,
      //   Name: 'SOURCE_IMAGE_NAME'
      // }
    },
    TargetImage: {
      Bytes: targetImage,
      // S3Object: {
      //   Bucket: process.env.AWS_BUCKET_NAME,
      //   Name: 'TARGET_IMAGE_NAME'
      // }
    },
    SimilarityThreshold: 80
});
 
const compareFaces = async (sourceImage, targetImage) => {
  return await rekognition.compareFaces(params(sourceImage, targetImage), (err, data) => {
    if (err) console.log(err, err.stack);
    else {
      console.log(data);
      return data;
    }
  });
}

module.exports = {
  compareFaces
}