const logger = require('../../logger');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cron = require('node-cron');
const userSchema = require('../models/user');
const {
    CREDIT_SCORE_VALIDATION, 
    APPROVED_STATUS_PENDING, 
    CREDIT_SCORE_VALIDATION_FRAUD,
    APPROVED_STATUS_APPROVED,
    APPROVED_STATUS_REJECTED,
    USER_SEGMENT_EMPLOYEE,
    USER_SEGMENT_CLIENT,
    AWS_CREATE_USER_CLIENT_SQS_MESSAGE,
    AWS_CREATE_USER_EMPLOYEE_SQS_MESSAGE,
    AWS_DELETE_USER_EMPLOYEE_SQS_MESSAGE
} = require('../helpers/constants');
const { userBuilderOrchestrator, userInfoUpdate } = require('../helpers/userHelper');
const { sendSNSEvent } = require('../services/awsSQS');

const create = async (req, res, next) =>
    userSchema(req.body).save()
        .then(data => res.status(201).send(data))
        .catch(error => res.status(500).send({message: error.message}));

cron.schedule('*/1 * * * *', async () => {
    await userInfoUpdate();
    logger.info('Cron running every one minute');
  });

const getUsers = async (req, res, next) => 
    userSchema.find({ 
        approved: APPROVED_STATUS_PENDING,
        fraudSituation: CREDIT_SCORE_VALIDATION.filter(v => v != CREDIT_SCORE_VALIDATION_FRAUD),
        segment: USER_SEGMENT_CLIENT
    })
    .then(data => res.status(200).send(data))
    .catch(error => res.status(500).send({message: error.message}));

const updateUser = async (req, res, next) => 
    userSchema.findOneAndUpdate({ _id: req.params.userId, approved: APPROVED_STATUS_PENDING}, { 
        approved: req.body.approved ?
         APPROVED_STATUS_APPROVED : 
         APPROVED_STATUS_REJECTED 
    }, { new: true })
    .then(data => data == null ? Promise.reject({message: 'User not found', status: 404}) : data)
    .then(async data => {
        await sendSNSEvent({email: data.email, status: data.approved}, AWS_CREATE_USER_CLIENT_SQS_MESSAGE);
        return data;
    })
    .then(data => res.status(200).send(data))
    .catch(error => res.status(error.status || 500).send({message: error.message}));

const createEmployee = async (req, res, next) =>  
    Promise.all(req.body.users.map(async currentUser => {
        const user = userSchema({
            ...currentUser,
            password: await bcrypt.hash(currentUser.password, 10),
            segment: USER_SEGMENT_EMPLOYEE,
            approved: APPROVED_STATUS_APPROVED
        });
        return user.save();
    }))
    .then(users => Promise.all(users.map(async usr => {
        await sendSNSEvent({email: usr.email}, AWS_CREATE_USER_EMPLOYEE_SQS_MESSAGE);
        return usr;
    })))
    .then(users => res.status(201).send(users.map(usr => ({email: usr.email}))))
    .catch(error => res.status(500).send({message: error.message}));


const loginEmployee = async (req, res, next) => 
    userSchema.findOne({ email: req.body.email.toString(), segment: USER_SEGMENT_EMPLOYEE })
        .then(data => {
            if(!data) {
                return res.status(401).json({ message: 'Invalid login credentials.' });
            }
            const { email, password } = req.body;
            const hashedPassword = data.password;
            return bcrypt.compare(password, hashedPassword)
                .then(passwordMatch => {
                    if (!passwordMatch && process.env.NODE_ENV != 'test') {
                        return res.status(401).json({ message: 'Invalid login credentials.' });
                    }
                    const token = process.env.NODE_ENV == 'test' ? 
                        'mockToken' : 
                        jwt.sign(
                            { email, password: hashedPassword }, 
                            process.env.TOKEN_SECRET, 
                            { expiresIn: '1h' }
                    );
                    return res.status(200).send({email: data.email, token, department: data.department })
                });
        })
        .catch(error => res.status(500).send({message: error.message}));

const getEmployees = async (req, res, next) => 
    userSchema.find({ 
        segment: USER_SEGMENT_EMPLOYEE
    },
    { password: 0, approved: 0, segment: 0, verified: 0 })
    .then(data => res.status(200).send(data))
    .catch(error => res.status(500).send({message: error.message}));

const deleteUser = async (req, res, next) => 
    userSchema.findOneAndDelete({ email: req.body.email.toString(), segment: USER_SEGMENT_EMPLOYEE})
        .then(data => data == null ? Promise.reject({message: 'User not found', status: 404}) : data)
        .then(async data => {
            await sendSNSEvent({email: data.email},AWS_DELETE_USER_EMPLOYEE_SQS_MESSAGE);
            return data;
        })
        .then(data => res.status(200).send({email: data.email}))
        .catch(error => res.status(error.status || 500).send({message: error.message}));

module.exports = { 
    create, 
    getUsers, 
    updateUser, 
    createEmployee, 
    loginEmployee, 
    getEmployees,
    deleteUser
 }