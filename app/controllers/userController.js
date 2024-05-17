const userSchema = require('../models/user');
const { 
    BIOMETRIC_VALIDATION, 
    BIOMETRIC_VALIDATION_INVALID, 
    CREDIT_SCORE_VALIDATION, 
    APPROVED_STATUS_PENDING, 
    CREDIT_SCORE_VALIDATION_FRAUD,
    APPROVED_STATUS_APPROVED,
    APPROVED_STATUS_REJECTED
} = require('../helpers/constants');
const { predictCreditScore } = require('../helpers/creditScoreHelper');

const create = async (req, res, next) => {
    const user = userSchema({
        ...req.body,
        // other uer params to add, parse password etc 
    });
    const { creditScore, fraudSituation } = predictCreditScore(req.body);
    user.creditScore = creditScore
    user.fraudSituation = fraudSituation;
    return await user.save()
        .then(data => res.status(201).send(data))
        .catch(error => res.status(500).send({message: error.message}));
}

const getUsers = async (req, res, next) => 
    userSchema.find({ 
        verified: BIOMETRIC_VALIDATION.filter(v => v != BIOMETRIC_VALIDATION_INVALID), 
        approved: APPROVED_STATUS_PENDING,
        fraudSituation: CREDIT_SCORE_VALIDATION.filter(v => v != CREDIT_SCORE_VALIDATION_FRAUD)
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
    .then(data => res.status(200).send(data))
    .catch(error => res.status(error.status || 500).send({message: error.message}));

const getUser = async (req, res, next) => {
    return userSchema.findById(req.params.userId)
        .then(data => res.status(200).send(data))
        .catch(error => res.status(500).send({message: error.message}));
}
    

module.exports = { create, getUsers, getUser, updateUser }