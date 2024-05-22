const { compareFaces } = require('../services/integracionRekognition');
const { BIOMETRIC_VALIDATION_VERIFIED, BIOMETRIC_VALIDATION_INVALID } = require('./constants');

const parseBiometricStatus = async (pictureIdPassport, pictureSelfie) => {
    // upload pictures to s3 and get path to send to compare faces
    const rekognitionResult = await compareFaces(pictureIdPassport, pictureSelfie);
    console.log("🚀 ~ parseBiometricStatus ~ rekognitionResult:", rekognitionResult)
    const trustLevel = 90;
    return { verified: trustLevel >= 80 && trustLevel < 100 ? 
        BIOMETRIC_VALIDATION_VERIFIED : 
        BIOMETRIC_VALIDATION_INVALID }
}

module.exports = {
    parseBiometricStatus
}