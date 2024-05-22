const AWS = require('aws-sdk');

// Configure the AWS SDK with your credentials and region
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: 'YOUR_SECRET_ACCESS_KEY',
  region: 'YOUR_REGION'
});

const rekognition = new AWS.Rekognition();

const params = {
    SourceImage: {
      S3Object: {
        Bucket: 'YOUR_BUCKET_NAME',
        Name: 'SOURCE_IMAGE_NAME'
      }
    },
    TargetImage: {
      S3Object: {
        Bucket: 'YOUR_BUCKET_NAME',
        Name: 'TARGET_IMAGE_NAME'
      }
    },
    SimilarityThreshold: 90
};
 
const compareFaces = () => {
  rekognition.compareFaces(params, (err, data) => {
    if (err) console.log(err, err.stack);
    else console.log(data);
  });
}

module.exports = {
  compareFaces
}