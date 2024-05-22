const { parseBiometricStatus } = require('../../app/helpers/rekognitionHelper');
const { compareFaces } = require('../../app/services/awsRekognition');

jest.mock('../../app/services/awsRekognition', () => ({
    compareFaces: jest.fn()
}));

const mockPicture = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAIAAADTED8xAAADMElEQVR4nOzVwQnAIBQFQYXff81RUkQCOyDj1YOPnbXWPmeTRef+/3O/OyBjzh3CD95BfqICMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMO0TAAD//2Anhf4QtqobAAAAAElFTkSuQmCC';

const mockAWS = {
    notVerified: {
        notEnoughSimilarity: {
            SourceImageFace: {
                BoundingBox: {},
                Confidence: 99.99480438232422
              },
            FaceMatches: [{ Similarity: 77.99846649169922, Face: [{}] }, { Similarity: 79.99846649169922, Face: [{}] }],
            UnmatchedFaces: []
        },
        noMatches: {
            SourceImageFace: {
                BoundingBox: {},
                Confidence: 99.99480438232422
              },
            FaceMatches: [],
            UnmatchedFaces: [
                {
                    BoundingBox: [],
                    Confidence: 99.99967956542969,
                    Landmarks: [],
                    Pose: [],
                    Quality: []
                }
            ]
        }
    },
    verifiedOk: {
        SourceImageFace: {
          BoundingBox: {},
          Confidence: 99.99480438232422
        },
        FaceMatches: [ { Similarity: 97.99846649169922, Face: [{}] }, { Similarity: 99.99846649169922, Face: [{}] } ],
        UnmatchedFaces: []
      },
    samePicture: {
        SourceImageFace: {
            BoundingBox: {},
            Confidence: 99.99480438232422
          },
          FaceMatches: [ { Similarity: 100.00, Face: [{}] }, { Similarity: 99.99846649169922, Face: [{}] } ],
          UnmatchedFaces: []
    },
    serviceError: {}
}

describe('RekognitionHelper tests', () => {

    beforeEach(() => {
      jest.resetAllMocks();
      jest.clearAllMocks();
    });

    it('should get verified status INVALID when face matches less than 80', async () => {
        compareFaces.mockResolvedValue(mockAWS.notVerified.notEnoughSimilarity);
        const result = await parseBiometricStatus(mockPicture, mockPicture);
        expect(result).toMatchObject({ verified: 'INVALID' });
    });

    it('should get verified status INVALID when there are no face matches', async () => {
        compareFaces.mockResolvedValue(mockAWS.notVerified.noMatches);
        const result = await parseBiometricStatus(mockPicture, mockPicture);
        expect(result).toMatchObject({ verified: 'INVALID' });
    });

    it('should get verified status VERIFIED when face matches between 80 and 100', async () => {
        compareFaces.mockResolvedValue(mockAWS.verifiedOk);
        const result = await parseBiometricStatus(mockPicture, mockPicture);
        expect(result).toMatchObject({ verified: 'VERIFIED' });
    });

    it('should get verified status INVALID when is the same picture', async () => {
        compareFaces.mockResolvedValue(mockAWS.samePicture);
        const result = await parseBiometricStatus(mockPicture, mockPicture);
        expect(result).toMatchObject({ verified: 'INVALID' });
    });

    it('should get no verified status when aws fails', async () => {
        compareFaces.mockRejectedValue(mockAWS.serviceError);
        const result = await parseBiometricStatus(mockPicture, mockPicture);
        expect(result).toMatchObject({});
    });
})