const mongoose = require("mongoose");
const { 
    BIOMETRIC_VALIDATION, 
    BIOMETRIC_VALIDATION_PENDING, 
    APPROVED_STATUS_PENDING,
    CREDIT_SCORE_VALIDATION,
    APPROVED_STATUS,
    VALID_HAS_TESLA_OPTIONS,
    VALID_EMPLOYMENT_SITUATION_OPTIONS,
    VALID_MONTHLY_INCOME_OPTIONS,
    VALID_IMMOVABLES_OPTIONS,
    USER_SEGMENT,
    USER_SEGMENT_CLIENT,
    GENDERS
} = require('../helpers/constants');

const isRequiredIfClient = () => this.segment == USER_SEGMENT_CLIENT;

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
    pictureSelfie: {
        type: String,
        required: isRequiredIfClient // BASE64 string
    },
    pictureIdPassport: {
        type: String,
        required: isRequiredIfClient // BASE64 string
    },
    immovables: {
        type: String,
        enum: VALID_IMMOVABLES_OPTIONS,
        required: isRequiredIfClient
    },
    monthlyIncome: {
        type: String,
        enum: VALID_MONTHLY_INCOME_OPTIONS,
        required: isRequiredIfClient
    },
    employmentSituation: {
        type: String,
        enum: VALID_EMPLOYMENT_SITUATION_OPTIONS,
        required: isRequiredIfClient
    },
    hasTesla: {
        type: String,
        enum: VALID_HAS_TESLA_OPTIONS,
        required: isRequiredIfClient
    },
    fraudSituation: {
        type: String,
        enum: CREDIT_SCORE_VALIDATION,
        required: isRequiredIfClient
    },
    creditScore: {
        type: Number,
        required: isRequiredIfClient
    },
    verified: {
        type: String,
        enum: BIOMETRIC_VALIDATION,
        default: BIOMETRIC_VALIDATION_PENDING
    },
    approved: {
        type: String,
        enum: APPROVED_STATUS,
        default: APPROVED_STATUS_PENDING
    },
    segment: {
        type: String,
        enum: USER_SEGMENT,
        default: USER_SEGMENT_CLIENT
    },
    password: {
        type: String,
        required: !isRequiredIfClient
    },
    monthlySalary: {
        type: Number,
        required: !isRequiredIfClient
    },
    department: {
        type: String,
        required: !isRequiredIfClient
    },
    state: {
        type: String,
        required: !isRequiredIfClient
    },
    gender: {
        type: String,
        enum: GENDERS,
        required: !isRequiredIfClient
    },
    birthDate: {
        type: Date,
        required: !isRequiredIfClient
    },
});

module.exports = mongoose.model('Users', userSchema);
