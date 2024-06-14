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

const sendSQSEvent = (data, message) => 
    sqs.sendMessage({
        MessageBody: JSON.stringify({
            operationType: message,
            data
        }),
        QueueUrl: process.env.AWS_SQS_QUEUE
      }).promise().then(() => logger.info(`Sent message ${message} to queue with the following data: ${JSON.stringify(data)}`));

const receiveSQSEvent = () =>
    sqs.receiveMessage({
        QueueUrl: process.env.AWS_WALLET_SQS_QUEUE,
        MaxNumberOfMessages: 10,
        WaitTimeSeconds: 20
    })
    .promise()
    .then(data => {
        if(!data.Messages) {
            logger.info('No hay mensajes en la cola');
        } else {
            data.Messages.filter(msg => JSON.parse(msg?.Body).operationType == 'CreateUser').forEach( message => {
                const payload = JSON.parse(message?.Body);
                logger.info(`Mensaje recibido: ${JSON.stringify(payload)}`);
                userSchema(payload.data).save()
                    .then(data => logger.info('Created user', data.email))
                    .catch(err => logger.info('Error al crear el usuario:', err))
            })
        }
    })
    .catch(error => console.error('Error al recibir mensajes de SQS', error));

setInterval(receiveSQSEvent, 5000);

module.exports = {
    sendSQSEvent,
    receiveSQSEvent
}