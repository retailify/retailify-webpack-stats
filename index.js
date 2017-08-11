var path = require('path');
var fs = require('fs');
var stripAnsi = require('strip-ansi');
var mkdirp = require('mkdirp');
var extend = require('deep-extend');

var DEFAULT_OUTPUT_FILENAME = 'webpack-stats.json';
var DEFAULT_LOG_TIME = false;
var DEFAULT_ABSOLUTE_PATH = '';


function Plugin(options) {
  this.contents = {};
  this.options = options || {};
  this.options.filename = this.options.filename || DEFAULT_OUTPUT_FILENAME;
  this.options.absolutePath = this.options.absolutePath || DEFAULT_ABSOLUTE_PATH;
  if (this.options.logTime === undefined) {
    this.options.logTime = DEFAULT_LOG_TIME;
  }
}

Plugin.prototype.apply = function(compiler) {
    var self = this;

    compiler.plugin('compilation', function(compilation) {
      compilation.plugin('failed-module', function(fail){
        var output = {
          status: 'error',
          error: fail.error.name || 'unknown-error'
        };
        if (fail.error.module !== undefined) {
          output.file = fail.error.module.userRequest;
        }
        if (fail.error.error !== undefined) {
          output.message = stripAnsi(fail.error.error.codeFrame);
        }
        self.writeOutput(compiler, output);
      });
    });

    compiler.plugin('compile', function() {
      self.writeOutput(compiler, {status: 'compiling'});
    });

    compiler.plugin('done', function(stats){
      if (stats.compilation.errors.length > 0) {
        var error = stats.compilation.errors[0];
        self.writeOutput(compiler, {
          status: 'error',
          error: error['name'] || 'unknown-error',
          message: stripAnsi(error['message'])
        });
        return;
      }

      var chunks = {};
      stats.compilation.chunks.map(function(chunk){
        var files = chunk.files.map(function(file){
          var F = {name: file};
          if (compiler.options.output.publicPath) {
            F.publicPath = compiler.options.output.publicPath + file;
          }
          var absolutePath = '';
          if (self.options.absolutePath) {
              absolutePath = self.options.absolutePath;
          }
          /*
          if (process.env.RETAILIFY_WEBPACK_STATS_ABSPATH) {
              absolutePath = process.env.RETAILIFY_WEBPACK_STATS_ABSPATH;
          }
          */
          if (absolutePath) {
            F.path = path.join(absolutePath, file);
          } else if (compiler.options.output.path) {
            F.path = path.join(compiler.options.output.path, file);
          }
          return F;
        });
        chunks[chunk.name] = files;
      });
      var output = {
        status: 'done',
        chunks: chunks
      };

      if (self.options.logTime === true) {
        output.startTime = stats.startTime;
        output.endTime = stats.endTime;
      }

      self.writeOutput(compiler, output);
    });
};


Plugin.prototype.writeOutput = function(compiler, contents) {
  var outputDir = this.options.path || '.';
  var outputFilename = path.join(outputDir, this.options.filename || DEFAULT_OUTPUT_FILENAME);
  if (compiler.options.output.publicPath) {
    contents.publicPath = compiler.options.output.publicPath;
  }
  mkdirp.sync(path.dirname(outputFilename));

  this.contents = extend(this.contents, contents);
  fs.writeFileSync(
    outputFilename,
    JSON.stringify(this.contents, null, this.options.indent)
  );
};

module.exports = Plugin;
