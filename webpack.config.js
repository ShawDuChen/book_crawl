const path = require('path');

module.exports = {
  mode: 'production',
  entry: './error-report.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'error-report.js'
  }
}
