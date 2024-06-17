const AWS = require('aws-sdk');
const { sendSNSEvent, receiveSQSEvent } = require('../../app/services/awsSQS');;
const userSchema = require('../../app/models/user');

// Mock the AWS.SQS class
jest.mock('aws-sdk', () => {
  const mSQS = {
    sendMessage: jest.fn().mockReturnThis(),
    promise: jest.fn(),
    receiveMessage: jest.fn().mockReturnThis(),
    deleteMessage: jest.fn().mockReturnThis(),
  };
  const mSNS = {
    publish: jest.fn().mockReturnThis(),
    sendMessage: jest.fn().mockReturnThis(),
    promise: jest.fn()
  };
  return {
    SQS: jest.fn(() => mSQS),
    SNS: jest.fn(() => mSNS),
    config: {
      update: jest.fn()
    }
  };
});

// Mock the userSchema model
jest.mock('../../app/models/user', () => jest.fn());

describe('SQS Module Tests', () => {
  const mSQSInstance = new AWS.SQS();
  const mSNSInstance = new AWS.SNS();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('sendSQSEvent sends a message to SQS', async () => {
    mSNSInstance.promise.mockResolvedValueOnce('success');

    const data = { email: 'test@example.com' };
    const message = 'CreateUser';

    await sendSNSEvent(data, message);

    expect(mSNSInstance.publish).toHaveBeenCalledWith({
      Message: JSON.stringify({
        operationType: message,
        data
      }),
      TopicArn: process.env.AWS_SNS_ARN
    });
    expect(mSNSInstance.promise).toHaveBeenCalled();
  });

  it('receiveSQSEvent receives messages from SQS', async () => {
    const mockMessages = {
      Messages: [
        {
          Body: JSON.stringify({
                operationType: 'CreateUser',
                data: { email: 'test@example.com' }
            }),
          ReceiptHandle: 'mockReceiptHandle'
        }
      ]
    };

    mSQSInstance.promise
      .mockResolvedValueOnce(mockMessages)
      .mockResolvedValueOnce('success');

    userSchema.mockImplementation(() => ({
      save: jest.fn().mockResolvedValueOnce({ email: 'test@example.com' })
    }));

    await receiveSQSEvent();

    expect(mSQSInstance.promise).toHaveBeenCalled();
  });

  test('receiveSQSEvent handles no messages in the queue', async () => {
    mSQSInstance.promise.mockResolvedValueOnce({});

    await receiveSQSEvent();

    expect(mSQSInstance.promise).toHaveBeenCalled();
  });

  test('receiveSQSEvent handles errors', async () => {
    const errorMessage = 'Error al recibir mensajes de SQS';
    mSQSInstance.promise.mockRejectedValueOnce(new Error(errorMessage));

    await receiveSQSEvent();

    expect(mSQSInstance.promise).toHaveBeenCalled();
  });
});
