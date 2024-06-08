const AWS = require('aws-sdk');
const { sendSQSEvent, receiveSQSEvent } = require('../../app/services/awsSQS');;
const userSchema = require('../../app/models/user');

// Mock the AWS.SQS class
jest.mock('aws-sdk', () => {
  const mSQS = {
    sendMessage: jest.fn().mockReturnThis(),
    promise: jest.fn(),
    receiveMessage: jest.fn().mockReturnThis(),
    deleteMessage: jest.fn().mockReturnThis(),
  };
  return {
    SQS: jest.fn(() => mSQS),
    config: {
      update: jest.fn()
    }
  };
});

// Mock the userSchema model
jest.mock('../../app/models/user', () => jest.fn());

describe('SQS Module Tests', () => {
  const mSQSInstance = new AWS.SQS();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('sendSQSEvent sends a message to SQS', async () => {
    mSQSInstance.promise.mockResolvedValueOnce('success');

    const data = { email: 'test@example.com' };
    const message = 'CreateUser';

    await sendSQSEvent(data, message);

    expect(mSQSInstance.sendMessage).toHaveBeenCalledWith({
      MessageBody: JSON.stringify({
        operationType: message,
        data
      }),
      QueueUrl: process.env.AWS_SQS_QUEUE
    });
    expect(mSQSInstance.promise).toHaveBeenCalled();
  });

  test('receiveSQSEvent receives messages from SQS', async () => {
    const mockMessages = {
      Messages: [
        {
          Body: JSON.stringify({ operationType: 'CreateUser', email: 'test@example.com' }),
          ReceiptHandle: 'mockReceiptHandle'
        }
      ]
    };

    mSQSInstance.promise
      .mockResolvedValueOnce(mockMessages)
    //   .mockResolvedValueOnce('success');

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
