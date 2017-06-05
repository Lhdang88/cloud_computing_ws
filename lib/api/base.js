/**
 * @description registers all APIs that are declared in this folder
 */

function registerAPIs(app) {
  console.log('Registering APIs ...');
  app.get('/', function (req, res) {
    res.send('Hello World!');
  });
}

module.exports = {
  registerAPIs
};
