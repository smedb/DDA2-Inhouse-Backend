const { compareFaces } = require('../services/integracionRekognition');
const { BIOMETRIC_VALIDATION_VERIFIED, BIOMETRIC_VALIDATION_INVALID } = require('./constants');

const parseBiometricStatus = async (pictureIdPassport, pictureSelfie) => {
    const rekognitionResult = await compareFaces(pictureIdPassport, pictureSelfie);
    if(!rekognitionResult || !rekognitionResult.FaceMatches) {
        console.log('There was an error trying to request Rekognition service');
        return {};
    }
    const trustLevel = rekognitionResult.FaceMatches.length > 0 ? 
        rekognitionResult.FaceMatches.sort(face => face.Similarity)[rekognitionResult.FaceMatches.length - 1].Similarity : 
        0;
    return { verified: trustLevel >= 80 && trustLevel < 100 ? 
        BIOMETRIC_VALIDATION_VERIFIED : 
        BIOMETRIC_VALIDATION_INVALID }
}

module.exports = {
    parseBiometricStatus
}