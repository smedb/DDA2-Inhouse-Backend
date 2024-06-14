const { userRouter } = require('./userRouter');
const { logRouter } = require('./logReader');

exports.init = app => {
  app.use('/', userRouter);
  app.use('/logs', logRouter);
}