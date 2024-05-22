const { 
    CREDIT_SCORE_VALIDATION_FRAUD,
    APPROVED_STATUS_REJECTED,
    CREDIT_SCORE_VALIDATION_TRUSTWORTHY,
    APPROVED_STATUS_APPROVED,
    BIOMETRIC_VALIDATION_VERIFIED
} = require('../helpers/constants');
const { predictCreditScore } = require('../helpers/creditScoreHelper');
const { parseBiometricStatus } = require('../helpers/rekognitionHelper');

const userBuilderOrchestrator = async (userData) => {
    const user = {
        ...userData,
        ...predictCreditScore(userData),
        ...await parseBiometricStatus(userData.pictureIdPassport, userData.pictureSelfie)
    }
    if(user.fraudSituation == CREDIT_SCORE_VALIDATION_FRAUD) {
        user.approved = APPROVED_STATUS_REJECTED;
    } else if(user.verified == BIOMETRIC_VALIDATION_VERIFIED && 
                user.fraudSituation == CREDIT_SCORE_VALIDATION_TRUSTWORTHY) {
        user.approved = APPROVED_STATUS_APPROVED;
    }
    return user;
}

module.exports = {
    userBuilderOrchestrator
}