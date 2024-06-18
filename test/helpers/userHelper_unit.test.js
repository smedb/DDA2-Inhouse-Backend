const { 
    CREDIT_SCORE_VALIDATION_FRAUD,
    APPROVED_STATUS_REJECTED,
    CREDIT_SCORE_VALIDATION_TRUSTWORTHY,
    APPROVED_STATUS_APPROVED,
    BIOMETRIC_VALIDATION_VERIFIED,
    APPROVED_STATUS_PENDING,
    USER_SEGMENT_CLIENT
} = require('../../app/helpers/constants');
const { predictCreditScore } = require('../../app/helpers/creditScoreHelper');
const { parseBiometricStatus } = require('../../app/helpers/rekognitionHelper');
const { userBuilderOrchestrator, userInfoUpdate } = require('../../app/helpers/userHelper');
const { sendSNSEvent } = require('../../app/services/awsSQS');
const userSchema = require('../../app/models/user');
// const { compareFaces } = require('../../app/services/awsRekognition');

jest.mock('../../app/services/awsRekognition', () => ({
    compareFaces: jest.fn()
}));
jest.mock('../../app/models/user');
jest.mock('../../app/services/awsSQS');
jest.mock('../../app/helpers/creditScoreHelper');
jest.mock('../../app/helpers/rekognitionHelper');

describe('Users Helper tests', () => {
    describe('UserBuilderOrchestrator Tests', () => {
        it('should reject user with fraud situation', async () => {
            const userData = { pictureIdPassport: 'id1', pictureSelfie: 'selfie1' };
            predictCreditScore.mockReturnValue({ fraudSituation: CREDIT_SCORE_VALIDATION_FRAUD });
            parseBiometricStatus.mockResolvedValue({});

            const result = await userBuilderOrchestrator(userData);
            expect(result.approved).toBe(APPROVED_STATUS_REJECTED);
        });

        it('should approve user with verified biometric and trustworthy credit score', async () => {
            const userData = { pictureIdPassport: 'id1', pictureSelfie: 'selfie1' };
            predictCreditScore.mockReturnValue({ fraudSituation: CREDIT_SCORE_VALIDATION_TRUSTWORTHY });
            parseBiometricStatus.mockResolvedValue({ verified: BIOMETRIC_VALIDATION_VERIFIED });

            const result = await userBuilderOrchestrator(userData);
            expect(result.approved).toBe(APPROVED_STATUS_APPROVED);
        });

        it('should not set approved if conditions are not met', async () => {
            const userData = { pictureIdPassport: 'id1', pictureSelfie: 'selfie1' };
            predictCreditScore.mockReturnValue({ fraudSituation: CREDIT_SCORE_VALIDATION_TRUSTWORTHY });
            parseBiometricStatus.mockResolvedValue({ verified: false });

            const result = await userBuilderOrchestrator(userData);
            expect(result.approved).toBeUndefined();
        });
    });


    describe('userInfoUpdate', () => {
        it('should update users and send SNS events for approved users', async () => {
            const users = [
                { _id: '1', email: 'user1@example.com', approved: APPROVED_STATUS_PENDING, segment: USER_SEGMENT_CLIENT },
                { _id: '2', email: 'user2@example.com', approved: APPROVED_STATUS_APPROVED, segment: USER_SEGMENT_CLIENT }
            ];
    
            userSchema.find.mockResolvedValue(users);
            userSchema.findOneAndUpdate.mockImplementation((query, update) => Promise.resolve({ ...update, _id: query._id }));
            sendSNSEvent.mockResolvedValue({});
    
            await userInfoUpdate();
    
            expect(userSchema.find).toHaveBeenCalled();
            expect(sendSNSEvent).toHaveBeenCalledTimes(1);
        });
    
        it('should handle errors during update', async () => {
            const users = [
                { _id: '1', email: 'user1@example.com', approved: APPROVED_STATUS_PENDING, segment: USER_SEGMENT_CLIENT }
            ];
    
            userSchema.find.mockResolvedValue(users);
            userSchema.findOneAndUpdate.mockImplementation(() => Promise.reject(new Error('Update error')));
    
            await userInfoUpdate();
    
            expect(userSchema.findOneAndUpdate).toHaveBeenCalled();
        });
    });
    
});