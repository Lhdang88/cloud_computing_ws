/**
 * @description Provides information about the running environment.
 */
const os = require('os');

module.exports = {
  hostname: os.hostname(),
  port: process.env.PORT || 3000,
  mongodb: {
    url: process.env.MONGO_DB || 'mongodb://localhost:27017/dhbw'
  },
  auth: {
    user: process.env.DHBW_USER || 'dhbw',
    password: process.env.DHBW_PASSWORD || 'dhbw-pw'
  }
};
