/**
 * @description registers all APIs that are declared in this folder
 */
// dependencies
const fs = require('fs');
const path = require('path');

// variables
const apiDirectory = './lib/api';

function registerAPIs(app, ws) {
  console.log('Registering APIs ...');

  // Base-middleware for processing all incoming requests
  app.use((req, res, next) => {
    // log all requests
    console.info(`Time: ${new Date()} Request: [${req.method}] ${req.originalUrl}`);
    next();
  });

  app.get('/', function (req, res) {
    res.send('Hello World!');
  });

  // Load REST API resource collections
  fs.readdirSync(apiDirectory).forEach((file) => {
    if (file.indexOf('base.js') < 0 && file.indexOf('.js') > 0) {
      console.info(`Loading REST API File: ${path.join(__dirname, file)} ...`);
      require(path.join(__dirname, file)).init(app, ws);
    }
  });
}

module.exports = {
  registerAPIs
};
