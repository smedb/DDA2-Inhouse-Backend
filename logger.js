const { createLogger, format, transports } = require('winston');
const path = require('path');

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    format.json(),
  ),
  transports: [
    new transports.File({
      filename: path.join(__dirname, 'logs', 'app.log'),
      maxsize: 1048576, // 1MB
      maxFiles: 2,
      tailable: true
    }),
    new transports.Console()
  ]
});

module.exports = logger;
