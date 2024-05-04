const { check } = require('express-validator');

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
      .withMessage('password field is not a string.')

      // add picture and remaining parameters, info from the questions like salary/job etc - also in the schema
  ];