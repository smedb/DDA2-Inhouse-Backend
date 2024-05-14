const { check } = require('express-validator');
const {
  VALID_IMMOVABLES_OPTIONS,
  VALID_MONTHLY_INCOME_OPTIONS,
  VALID_EMPLOYMENT_SITUATION_OPTIONS,
  VALID_HAS_TESLA_OPTIONS
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

    check('password')
      .exists()
      .withMessage('password field is empty.')
      .isString()
      .withMessage('password field is not a string.'),

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

      // add picture and remaining parameters, info from the questions like salary/job etc - also in the schema
  ];