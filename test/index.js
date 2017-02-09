// This will search for files ending in .test.js and require them
// so that they are added to the webpack bundle
var context = require.context('.', true, /.+\.spec\.js?$/);
context.keys().forEach(context);
module.exports = context;