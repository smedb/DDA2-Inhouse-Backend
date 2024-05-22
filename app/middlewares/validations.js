const { validationResult, matchedData } = require('express-validator');

exports.validate = {
  validations: (req, res, next) => {
    try {
      const result = validationResult(req);
      const data = matchedData(req);

      if (Object.keys(data).length !== Object.keys(req.body).length) {
        result.errors.push({
          msg: `The expected body fields are ${Object.keys(data).join(', ')}`,
        });
      }
      
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