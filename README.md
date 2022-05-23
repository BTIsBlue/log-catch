# a log catch loader
一个可以自动为logger相关调用添加try catch的loader
# Usage
```javascript
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
```
