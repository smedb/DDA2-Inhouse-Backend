const { userRouter } = require('./userRouter');

exports.init = app => {
  app.use('/', userRouter);
}