/**
 * @description registers all APIs that are declared in this folder
 */
// dependencies
const express = require('express');
const fs = require('fs');
const path = require('path');
const basicAuth = require('express-basic-auth');
const cred = require('../environment').auth;

// variables
const apiDirectory = './lib/api';

function registerAPIs(app, ws) {
  console.log('Registering APIs ...');
  // add basic auth for all routes
  const auth = {
      users: { [cred.user]: cred.password },
      unauthorizedResponse: 'Not Authorized, please provide valid authorization credentials.'
  };
  console.log(`Set Basic-Auth credentials with ${JSON.stringify(auth)}`);
  app.use(express.static('static'))
  app.use(/^\/api/, basicAuth(auth));
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
