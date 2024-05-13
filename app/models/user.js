const mongoose = require("mongoose");
const { 
    BIOMETRIC_VALIDATION, 
    BIOMETRIC_VALIDATION_PENDING, 
    APPROVED_STATUS_PENDING,
    CREDIT_SCORE_VALIDATION,
    APPROVED_STATUS
} = require('../helpers/constants');


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
    verified: {
        type: String,
        enum: BIOMETRIC_VALIDATION,
        default: BIOMETRIC_VALIDATION_PENDING
    },
    fraudSituation: {
        type: String,
        enum: CREDIT_SCORE_VALIDATION
    },
    approved: {
        type: String,
        enum: APPROVED_STATUS,
        default: APPROVED_STATUS_PENDING
    }
    // TODO: ADD remaining properties such as picture, job, salary, etc
});

module.exports = mongoose.model('Users', userSchema);
