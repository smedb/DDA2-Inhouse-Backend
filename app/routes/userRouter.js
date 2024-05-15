const { Router } = require('express');
const userController = require('../controllers/userController');

const { bodyPostUserIsComplete, bodyPutUserIsComplete } = require('../middlewares/userValidations');
const { validate } = require('../middlewares/validations');

const routes = Router();

// TODO: Add token validation to endpoints as middleware
// TODO: Add more endpoints such as login or put to update user

routes.post("/users", bodyPostUserIsComplete, validate.validations, userController.create);

routes.get("/users/unapproved", userController.getUsers);

routes.put("/users/:userId", bodyPutUserIsComplete, validate.validations, userController.updateUser);

routes.get("/users/:userId", userController.getUser);

module.exports = { userRouter: routes };