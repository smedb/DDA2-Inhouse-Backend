const logger = require('./logger');
const app = require('./app');

const port = process.env.PORT || 8080;

Promise.resolve()
  .then(() => {
    app.listen(port);

    logger.info(`Listening on port: ${port}`);
  })
  .catch(error => logger.info(error));
