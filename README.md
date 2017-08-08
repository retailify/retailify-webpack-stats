# retailify-webpack-stats

This is an extended version of [webpack-bundle-tracker](https://github.com/ezhome/webpack-bundle-tracker).
For our changes we've written [ava](https://github.com/avajs/ava) tests.



## Install

```bash
npm install --save-dev retailify-webpack-stats
```

## Usage

### Precedence Rule

If the absolutePath is set, the path option is ignored.

```javascript
var BundleTracker  = require('retailify-webpack-stats');
module.exports = {
        context: __dirname,
    entry: {
      app: ['./app']
    },

    output: {
        path: require("path").resolve('./assets/bundles/'),
        filename: "[name]-[hash].js",
        publicPath: 'http://localhost:3000/assets/bundles/',
    },

    plugins: [
      new BundleTracker({
        absolutePath: '/usr/src/app',
        filename: './assets/webpack-stats.json',
        indent: 2
      })
    ]
}
```

`./assets/webpack-stats.json` will look like,

```json
{
  "status":"done",
  "chunks":{
   "app":[{
      "name":"app-0828904584990b611fb8.js",
      "publicPath":"http://localhost:3000/assets/bundles/app-0828904584990b611fb8.js",
      "path":"/home/user/project-root/assets/bundles/app-0828904584990b611fb8.js"
    }]
  }
}
```

In case webpack is still compiling, it'll look like,


```json
{
  "status":"compiling",
}
```

And errors will look like,
```json
{
  "status": "error",
  "file": "/path/to/file/that/caused/the/error",
  "error": "ErrorName",
  "message": "ErrorMessage"
}
```

`ErrorMessage` shows the line and column that caused the error.



And in case `logTime` option is set to `true`, the output will look like,
```
{
  "status":"done",
  "chunks":{
   "app":[{
      "name":"app-0828904584990b611fb8.js",
      "publicPath":"http://localhost:3000/assets/bundles/app-0828904584990b611fb8.js",
      "path":"/usr/src/app/assets/bundles/app-0828904584990b611fb8.js"
    }]
  },
  "startTime":1440535322138,
  "endTime":1440535326804
}
```

By default, the output JSON will not be indented. To increase readability, you can use the `indent`
option to make the output legible. By default it is off. The value that is set here will be directly
passed to the `space` parameter in `JSON.stringify`. indent can be a number (up to 10) or whitespaces. More information can be found here:
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify

## Authors

* [Owais Lone](https://github.com/owais)

* [Thomas Meitz](https://github.com/retailify)
