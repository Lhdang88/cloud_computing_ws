/**
 * @description Provides information about the running environment.
 */
const os = require('os');

module.exports = {
  hostname: os.hostname(),
  port: 3000
};
