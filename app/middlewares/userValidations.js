const { check } = require('express-validator');
const {
  VALID_IMMOVABLES_OPTIONS,
  VALID_MONTHLY_INCOME_OPTIONS,
  VALID_EMPLOYMENT_SITUATION_OPTIONS,
  VALID_HAS_TESLA_OPTIONS,
  GENDERS
} = require('../helpers/constants');

exports.bodyPostUserIsComplete = [
    check('email')
      .exists()
      .withMessage('email field is empty.')
      .isString()
      .withMessage('email field is not a string.')
      .isEmail()
      .withMessage('email field is not an email.'),

    check('firstName')
      .exists()
      .withMessage('firstName field is empty.')
      .isString()
      .withMessage('firstName field is not a string.'),

    check('lastName')
      .exists()
      .withMessage('lastName field is empty.')
      .isString()
      .withMessage('lastName field is not a string.'),

    check('pictureSelfie')
      .exists()
      .withMessage('pictureSelfie field is empty.')
      .isString()
      .withMessage('pictureSelfie field is not a string.')
      .matches(/data:image/)
      .withMessage('pictureSelfie should be a base 64 image.'),

    check('pictureIdPassport')
      .exists()
      .withMessage('pictureIdPassport field is empty.')
      .isString()
      .withMessage('pictureIdPassport field is not a string.')
      .matches(/data:image/)
      .withMessage('pictureIdPassport should be a base 64 image.'),

    check('immovables')
      .exists()
      .withMessage('immovables field is empty.')
      .isString()
      .withMessage('immovables field is not a string.')
      .isIn(VALID_IMMOVABLES_OPTIONS)
      .withMessage(`immovables should be one of these values: ${VALID_IMMOVABLES_OPTIONS.join(', ')}`),

    check('monthlyIncome')
      .exists()
      .withMessage('monthlyIncome field is empty.')
      .isString()
      .withMessage('monthlyIncome field is not a string.')
      .isIn(VALID_MONTHLY_INCOME_OPTIONS)
      .withMessage(`monthlyIncome should be one of these values: ${VALID_MONTHLY_INCOME_OPTIONS.join(', ')}`),
    
    check('employmentSituation')
      .exists()
      .withMessage('employmentSituation field is empty.')
      .isString()
      .withMessage('employmentSituation field is not a string.')
      .isIn(VALID_EMPLOYMENT_SITUATION_OPTIONS)
      .withMessage(`employmentSituation should be one of these values: ${VALID_EMPLOYMENT_SITUATION_OPTIONS.join(', ')}`),

    check('hasTesla')
      .exists()
      .withMessage('hasTesla field is empty.')
      .isString()
      .withMessage('hasTesla field is not a string.')
      .isIn(VALID_HAS_TESLA_OPTIONS)
      .withMessage(`hasTesla should be one of these values: ${VALID_HAS_TESLA_OPTIONS.join(', ')}`)
  ];

exports.bodyPutUserIsComplete = [
    check('approved')
      .exists()
      .withMessage('approved field is empty.')
      .isBoolean()
      .withMessage('approved field is not a boolean.'),
]

exports.bodyPostEmployeeIsComplete = [
  check('users')
    .exists()
    .withMessage('users field is empty.')
    .isArray()
    .withMessage('users field is not an array.'),

  check('users.*.email')
    .exists()
    .withMessage('email field is empty.')
    .isString()
    .withMessage('email field is not a string.')
    .isEmail()
    .withMessage('email field is not an email.'),

  check('users.*.firstName')
    .exists()
    .withMessage('firstName field is empty.')
    .isString()
    .withMessage('firstName field is not a string.'),

  check('users.*.lastName')
    .exists()
    .withMessage('lastName field is empty.')
    .isString()
    .withMessage('lastName field is not a string.'),

  check('users.*.password')
    .exists()
    .withMessage('password field is empty.')
    .isString()
    .withMessage('password field is not a string.'),

  check('users.*.monthlySalary')
    .exists()
    .withMessage('monthlySalary field is empty.')
    .isFloat()
    .withMessage('monthlySalary field is not a float.'),

  check('users.*.department')
    .exists()
    .withMessage('department field is empty.')
    .isString()
    .withMessage('department field is not a string.'),

  check('users.*.state')
    .exists()
    .withMessage('state field is empty.')
    .isString()
    .withMessage('state field is not a string.'),

  check('users.*.gender')
    .exists()
    .withMessage('gender field is empty.')
    .isString()
    .withMessage('gender field is not a string.')
    .isIn(GENDERS)
    .withMessage(`gender should be one of these values: ${GENDERS.join(', ')}`),

  check('users.*.birthDate')
    .exists()
    .withMessage('birthDate field is empty.')
    .isString()
    .withMessage('birthDate field is not a string.')
    .isDate()
    .withMessage('birthDate field is not a date.')
];

exports.bodyPostEmployeeLoginIsComplete = [
  check('email')
    .exists()
    .withMessage('email field is empty.')
    .isString()
    .withMessage('email field is not a string.')
    .isEmail()
    .withMessage('email field is not an email.'),

  check('password')
    .exists()
    .withMessage('password field is empty.')
    .isString()
    .withMessage('password field is not a string.')
];
