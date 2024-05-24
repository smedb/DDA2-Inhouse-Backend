const { Router } = require('express');
const userController = require('../controllers/userController');

const { 
    bodyPostUserIsComplete, 
    bodyPutUserIsComplete, 
    bodyPostEmployeeLoginIsComplete, 
    bodyPostEmployeeIsComplete,
    bodyDeleteEmployeeIsComplete } = require('../middlewares/userValidations');
const { validate } = require('../middlewares/validations');
const { validateToken } = require('../middlewares/validateToken');

const routes = Router();

// TODO: Add token validation to endpoints as middleware
// TODO: Add more endpoints such as login or put to update user

routes.post("/users", bodyPostUserIsComplete, validate.validations, userController.create);

routes.get("/users/unapproved", validateToken, userController.getUsers);

routes.put("/users/:userId", bodyPutUserIsComplete, validateToken, validate.validations, userController.updateUser);

routes.post("/users/employee", bodyPostEmployeeIsComplete, validate.validations, userController.createEmployee);

routes.post("/users/employee/login", bodyPostEmployeeLoginIsComplete, validate.validations, userController.loginEmployee);

routes.get("/users/employee", validateToken, userController.getEmployees);

routes.delete("/users/employee", bodyDeleteEmployeeIsComplete, validateToken, validate.validations, userController.deleteUser);


module.exports = { userRouter: routes };