const userSchema = require('../models/user');
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
    userSchema.find()
        .then(data => res.status(200).send(data))
        .catch(error => res.status(500).send({message: error.message}));

const getUser = async (req, res, next) => {
    return userSchema.findById(req.params.userId)
        .then(data => res.status(200).send(data))
        .catch(error => res.status(500).send({message: error.message}));
}
    

module.exports = { create, getUsers, getUser }