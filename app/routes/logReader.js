const { Router } = require('express');
const fs = require('fs');
const path = require('path');

const routes = Router();

const readLogs = (req, res) => {
  const logFilePath = path.join(__dirname, '..', '..', 'logs', 'app.log');
  fs.readFile(logFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading log file', err);
      return res.status(500).send('Error reading log file');
    }
    res.send(`<pre>${data}</pre>`);
  });
};

routes.get('/', readLogs);

module.exports = { logRouter: routes };


