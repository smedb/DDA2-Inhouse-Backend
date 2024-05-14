const mongoose = require("mongoose");
const { CREDIT_SCORE_VALIDATION, VALID_HAS_TESLA_OPTIONS, VALID_EMPLOYMENT_SITUATION_OPTIONS, VALID_MONTHLY_INCOME_OPTIONS, VALID_IMMOVABLES_OPTIONS } = require('../helpers/constants');

const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        trim: true, 
        index: {
            unique: true,
            partialFilterExpression: {email: {$type: "string"}}
        }
    },
    password: { // TODO: ENCRYPT WITH JWT
        type: String,
        required: false
    },
    immovables: {
        type: String,
        enum: VALID_IMMOVABLES_OPTIONS,
        required: true
    },
    monthlyIncome: {
        type: String,
        enum: VALID_MONTHLY_INCOME_OPTIONS,
        required: true
    },
    employmentSituation: {
        type: String,
        enum: VALID_EMPLOYMENT_SITUATION_OPTIONS,
        required: true
    },
    hasTesla: {
        type: String,
        enum: VALID_HAS_TESLA_OPTIONS,
        required: true
    },
    fraudSituation: {
        type: String,
        enum: CREDIT_SCORE_VALIDATION,
        required: true
    },
    creditScore: {
        type: Number,
        required: true
    }
    // TODO: ADD remaining properties such as picture, job, salary, etc
});

module.exports = mongoose.model('Users', userSchema);
