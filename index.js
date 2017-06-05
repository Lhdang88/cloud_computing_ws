/**
 * @description Main Entry - creates an Express Server on Port 3000.
 */

/**
 * dependencies - reference modules with require-keyword
 */
let express = require('express');
let env = require('./lib/environment');
let api = require('./lib/api/base');

/**
* variables - here you can define local variables
*/
//initialize the express http-module
let app = express();

// start the http-server on port:xxxx
app.listen(env.port, function() {
  console.log(`App is listening on port ${env.port}`);
});

// register APIs - register all files under /lib/api/...
api.registerAPIs(app);

/**
 * exit handling - the exitHandler function is called when the events are fired.
 */
function exitHandler(process, event) {
  console.log(`Event ${event.type} received`);

  if(event.exit) {
    console.log(`Shutting down app on ${env.hostname} ...`);
    process.exit();
  }
}

// Catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, process, { exit: true, type: 'SIGINT' }));
// Catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, process, { exit: true, type: 'uncaughtException' }));
