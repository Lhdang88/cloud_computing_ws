/**
 * @description Provides information about the running environment.
 */
let os = require('os');

module.exports = {
  hostname: os.hostname(),
  port: 3000
};
