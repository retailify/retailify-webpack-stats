# retailify-webpack-stats

[![npm version](https://badge.fury.io/js/retailify-webpack-stats.svg)](https://badge.fury.io/js/retailify-webpack-stats) [![Build Status](https://travis-ci.org/retailify/retailify-webpack-stats.svg?branch=master)](https://travis-ci.org/retailify/retailify-webpack-stats)

This is an extended version of [webpack-bundle-tracker](https://github.com/ezhome/webpack-bundle-tracker) and we are using it as drop in replacement for our daily use.

**How we are using it?**

We are using [webpack-bundler](https://github.com/webpack/webpack) in a django docker environment, so we had to replace the generated path in webpack-stats.json with the docker app mount point (e.g. /usr/src/app) each time we are building the container.

**What next?**

Our intention is to:

* write more tests to get a good coverage and test it via travis

* integrate and test: [Adds trackAssets option to plugin](https://github.com/ezhome/webpack-bundle-tracker/pull/24)


## Install

```bash
npm install --save-dev retailify-webpack-stats
```


## Usage

### Rules

* **absolutePath** overwrites the **path option** in webpack.config.js.

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

## Support

If you have discovered a 🐜 or have a feature suggestion, feel free to create an issue on Github.

## Changelog
**Version 0.0.5**
- integrated Code Coverage && Eslint
- integrated Travis
- Rework of examples & tests

**Version 0.0.4**
- Update README

**Version 0.0.3**
- examples added

**Version 0.0.2**
- absolutePath implemented
- initial commit

## Authors

* [Owais Lone](https://github.com/owais) Thank you for this piece of code!

* [Thomas Meitz](https://github.com/retailify)
