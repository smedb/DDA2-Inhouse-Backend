const userController = require('./controllers/userController');

const { bodyPostUserIsComplete } = require('./middlewares/userValidations');


const { validate } = require('./middlewares/validations');

exports.init = app => {
  // TODO: Add token validation to endpoints as middleware
  // TODO: Add more endpoints such as login or put to update user

  app.get("/health_check", (req, res) => res.status(200).send("Hello World!"));

  app.post("/users", [bodyPostUserIsComplete, validate.validations], userController.create);

  app.get("/users", [], userController.getUsers);

  app.get("/users/:userId", [], userController.getUser);

}