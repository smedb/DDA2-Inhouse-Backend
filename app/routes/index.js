const { userRouter } = require('./userRouter');
const { healthCheckRouter } = require('./healthCheckRouter');

exports.init = app => {
  app.use('/', userRouter);
  app.use('/', healthCheckRouter);
}