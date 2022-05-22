const path = require('path')
module.exports = {
  entry: './example/main.js',
  module: {
    rules: [
      {
        test: /\.js/,
        use: [
          {
            loader: 'log-catch-loader',
            options: {
              callerName: 'logger',
              callFnName: 'log'
            }
          }
        ]
      }
    ],
  },
  resolveLoader: {
    alias: {
      'log-catch-loader': require.resolve('../lib')
    }
  },
}
