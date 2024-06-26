const VALID_IMMOVABLES_OPTIONS = ["0", "1-2", ">2"];
const VALID_MONTHLY_INCOME_OPTIONS = ["<500", "<1000", ">1000"];
const VALID_EMPLOYMENT_SITUATION_OPTIONS = ["employee", "self-employed", "unemployed"];
const VALID_HAS_TESLA_OPTIONS = ["no", "yes"];

const ML_MODEL_VARIABLES = [
    {
        key: "immovables",
        options: VALID_IMMOVABLES_OPTIONS
    },
    {
        key: "monthly_income",
        options: VALID_MONTHLY_INCOME_OPTIONS
    },
    {
        key: "employment_situation",
        options: VALID_EMPLOYMENT_SITUATION_OPTIONS
    },
    {
        key: "has_tesla",
        options: VALID_HAS_TESLA_OPTIONS
    }
];

const BIOMETRIC_VALIDATION_VERIFIED = 'VERIFIED';
const BIOMETRIC_VALIDATION_PENDING = 'PENDING';
const BIOMETRIC_VALIDATION_INVALID = 'INVALID';
const CREDIT_SCORE_VALIDATION_FRAUD = 'FRAUD';
const CREDIT_SCORE_VALIDATION_PENDING_RISKY = 'PENDING_RISKY';
const CREDIT_SCORE_VALIDATION_PENDING_RELIABLE = 'PENDING_RELIABLE';
const CREDIT_SCORE_VALIDATION_TRUSTWORTHY = 'TRUSTWORTHY';
const APPROVED_STATUS_APPROVED = 'APPROVED';
const APPROVED_STATUS_REJECTED = 'REJECTED';
const APPROVED_STATUS_PENDING = 'PENDING';
const USER_SEGMENT_CLIENT = 'CLIENT';
const USER_SEGMENT_EMPLOYEE = 'EMPLOYEE';

const USER_SEGMENT = [ USER_SEGMENT_CLIENT, USER_SEGMENT_EMPLOYEE ];
const GENDERS = ['F', 'M', 'Other'];

const BIOMETRIC_VALIDATION = [
    BIOMETRIC_VALIDATION_VERIFIED,
    BIOMETRIC_VALIDATION_PENDING,
    BIOMETRIC_VALIDATION_INVALID
];

const CREDIT_SCORE_VALIDATION = [
    CREDIT_SCORE_VALIDATION_FRAUD, 
    CREDIT_SCORE_VALIDATION_PENDING_RISKY, 
    CREDIT_SCORE_VALIDATION_PENDING_RELIABLE, 
    CREDIT_SCORE_VALIDATION_TRUSTWORTHY
];

const APPROVED_STATUS = [
    APPROVED_STATUS_APPROVED,
    APPROVED_STATUS_REJECTED,
    APPROVED_STATUS_PENDING
];

const CREDIT_SCORE_RANGES = {
    '0-450': CREDIT_SCORE_VALIDATION_FRAUD,
    '451-700': CREDIT_SCORE_VALIDATION_PENDING_RISKY,
    '701-900': CREDIT_SCORE_VALIDATION_PENDING_RELIABLE,
    '901-': CREDIT_SCORE_VALIDATION_TRUSTWORTHY
}

const AWS_CREATE_USER_CLIENT_SQS_MESSAGE = 'CreateUserClientConfirmation';
const AWS_CREATE_USER_EMPLOYEE_SQS_MESSAGE = 'CreateUserEmployee';
const AWS_DELETE_USER_EMPLOYEE_SQS_MESSAGE = 'DeleteUserEmployee';

module.exports = { 
    ML_MODEL_VARIABLES,  
    BIOMETRIC_VALIDATION, 
    CREDIT_SCORE_VALIDATION,
    CREDIT_SCORE_VALIDATION_FRAUD,
    BIOMETRIC_VALIDATION_PENDING,
    BIOMETRIC_VALIDATION_INVALID,
    BIOMETRIC_VALIDATION_VERIFIED,
    APPROVED_STATUS,
    APPROVED_STATUS_PENDING,
    CREDIT_SCORE_RANGES,
    VALID_IMMOVABLES_OPTIONS,
    VALID_MONTHLY_INCOME_OPTIONS,
    VALID_EMPLOYMENT_SITUATION_OPTIONS,
    VALID_HAS_TESLA_OPTIONS,
    APPROVED_STATUS_APPROVED,
    APPROVED_STATUS_REJECTED,
    USER_SEGMENT,
    USER_SEGMENT_CLIENT,
    USER_SEGMENT_EMPLOYEE,
    GENDERS,
    CREDIT_SCORE_VALIDATION_TRUSTWORTHY,
    AWS_CREATE_USER_CLIENT_SQS_MESSAGE,
    AWS_CREATE_USER_EMPLOYEE_SQS_MESSAGE,
    AWS_DELETE_USER_EMPLOYEE_SQS_MESSAGE
};