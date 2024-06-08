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
      }).promise();

const receiveSQSEvent = () =>
    sqs.receiveMessage({
        QueueUrl: process.env.AWS_WALLET_SQS_QUEUE,
        MaxNumberOfMessages: 10,
        WaitTimeSeconds: 20
    })
    .promise()
    .then(data => {
        if(!data.Messages) {
            console.log('No hay mensajes en la cola');
        }
        data.Messages.forEach( message => {
            console.log('Mensaje recibido:', message?.Body);
            userSchema(message?.Body).save()
                .then(data => console.log('Created user', message?.Body?.email))
            return sqs.deleteMessage({
                QueueUrl: process.env.AWS_WALLET_SQS_QUEUE,
                ReceiptHandle: message.ReceiptHandle
            })
            .promise()
            .then(() => console.log('Mensaje eliminado'));
        })
    })
    .catch(error => console.error('Error al recibir mensajes de SQS', error));

setInterval(receiveSQSEvent, 5000);

module.exports = {
    sendSQSEvent
}