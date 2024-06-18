const logger = require('../../logger');
const AWS = require('aws-sdk');
require('dotenv').config();
const userSchema = require('../models/user');

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'us-east-1'
});

const sqs = new AWS.SQS({ apiVersion: "2012-11-05" });
const sns = new AWS.SNS({ apiVersion: "2012-11-05" });


const sendSNSEvent = async (data, message) =>
    sns.publish({
        Message: JSON.stringify({
            operationType: message,
            data
        }),
        TopicArn: process.env.AWS_SNS_ARN
      })
    .promise()
    .then(() => logger.info(`Sent message ${message} to queue with the following data: ${JSON.stringify(data)}`))
    .catch(err => logger.info(err));

const receiveSQSEvent = () =>
    sqs.receiveMessage({
        QueueUrl: process.env.AWS_SQS_QUEUE,
        MaxNumberOfMessages: 10,
        WaitTimeSeconds: 20
    })
    .promise()
    .then( async data => {
        if(!data.Messages) {
            logger.info('No hay mensajes en la cola');
        } else {
            return await Promise.all(data.Messages.map(async message => {
                const payload = JSON.parse(message?.Body);
                if( payload.operationType == 'CreateUser' ) {
                    logger.info(`Mensaje recibido: ${JSON.stringify(payload)}`);
                    await userSchema(payload.data).save()
                        .then(data => logger.info('Created user', data.email))
                        .catch(err => logger.info('Error al crear el usuario:', err))
                }
                return await sqs.deleteMessage({
                    QueueUrl: process.env.AWS_SQS_QUEUE,
                    ReceiptHandle: message.ReceiptHandle
                })
                .promise()
                .then(() => logger.info(`Mensaje eliminado ${JSON.stringify(message.Body)}`))
                .catch(err => logger.info(err));
            }));
        }
    })
    .catch(error => logger.info('Error al recibir mensajes de SQS', error));

setInterval(receiveSQSEvent, 5000);

module.exports = {
    receiveSQSEvent,
    sendSNSEvent
}