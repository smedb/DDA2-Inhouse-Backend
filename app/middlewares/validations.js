const { validationResult } = require('express-validator');

exports.validate = {
  validations: (req, res, next) => {
    try {
      const result = validationResult(req);
      if (result.isEmpty()) {
        next();
      } else {
        result.throw();
      }
      res.status(200);
    } catch (err) {
      const map = err.array();
      res.status(400).send({ message: map[0].msg });
    }
  }
};