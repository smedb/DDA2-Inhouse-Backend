const { 
    CREDIT_SCORE_VALIDATION_FRAUD,
    APPROVED_STATUS_REJECTED,
    CREDIT_SCORE_VALIDATION_TRUSTWORTHY,
    APPROVED_STATUS_APPROVED,
    BIOMETRIC_VALIDATION_VERIFIED,
    APPROVED_STATUS_PENDING,
    USER_SEGMENT_CLIENT,
    AWS_CREATE_USER_CLIENT_SQS_MESSAGE
} = require('../helpers/constants');
const logger = require('../../logger');
const userSchema = require('../models/user');
const { predictCreditScore } = require('../helpers/creditScoreHelper');
const { parseBiometricStatus } = require('../helpers/rekognitionHelper');
const { sendSNSEvent } = require('../services/awsSQS');

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

const userInfoUpdate = async () =>
    await userSchema.find({ 
        approved: APPROVED_STATUS_PENDING,
        fraudSituation: { $exists: false },
        segment: USER_SEGMENT_CLIENT
    })
    .then(data => Promise.all(data.map(async currentUser => {
        const completeUser = await userBuilderOrchestrator(JSON.parse(JSON.stringify(currentUser)));
            return await userSchema.findOneAndUpdate({ _id: currentUser._id}, { 
                    ...completeUser
            }, { new: true })
            .then(usr => usr)
            .catch(error =>logger.info(error))
        }))
    )
    .then(async users => {
        return await Promise.all(
        users.filter(usr=> usr.approved != APPROVED_STATUS_PENDING)
            .map(approvedUsr => sendSNSEvent({email: approvedUsr.email, status: approvedUsr.approved}, AWS_CREATE_USER_CLIENT_SQS_MESSAGE))
        )}).catch(error =>logger.info(error));

module.exports = {
    userBuilderOrchestrator,
    userInfoUpdate
}