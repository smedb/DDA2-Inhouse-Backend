const { compareFaces } = require('../services/awsRekognition');
const { BIOMETRIC_VALIDATION_VERIFIED, BIOMETRIC_VALIDATION_INVALID } = require('./constants');

const parseBiometricStatus = async (pictureIdPassport, pictureSelfie) => {
    const rekognitionResult = await compareFaces(pictureIdPassport, pictureSelfie).then(val => val).catch(err => console.log(err));
    if(!rekognitionResult || !rekognitionResult.FaceMatches) {
        console.log('There was an error trying to request Rekognition service');
        return {};
    }
    const trustLevel = rekognitionResult.FaceMatches.length > 0 ? 
        rekognitionResult.FaceMatches.sort((a, b) => b.Similarity - a.Similarity)[0].Similarity : 
        0;
    return { verified: (trustLevel >= 80 && trustLevel < 100) ? 
        BIOMETRIC_VALIDATION_VERIFIED : 
        BIOMETRIC_VALIDATION_INVALID }
}

module.exports = {
    parseBiometricStatus
}