const { Router } = require('express');
const userController = require('../controllers/userController');

const { bodyPostUserIsComplete } = require('../middlewares/userValidations');
const { validate } = require('../middlewares/validations');

const routes = Router();

// TODO: Add token validation to endpoints as middleware
// TODO: Add more endpoints such as login or put to update user

routes.post("/users", bodyPostUserIsComplete, validate.validations, userController.create);

routes.get("/users", userController.getUsers);

routes.get("/users/:userId", userController.getUser);

module.exports = { userRouter: routes };