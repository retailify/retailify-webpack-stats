import test from 'ava';
import webpack from 'webpack';

const optionsPath = require('./examples/abspath/webpack.config');
const optionsEnvabsPath = require('./examples/envabspath/webpack.config');
const optionsStandardPath = require('./examples/standardpath/webpack.config');

test.cb('webpack-stats.json should contain a file path, which starts with /usr/src/app', t => {
  webpack(optionsPath, function (err, stats) {
    if (err) {
      return t.end(err);
    } else if (stats.hasErrors()) {
      return t.end(stats.toString());
    }

    const wpstats = require('./assets/bundles/abspath/webpack-stats.json');
    const files = wpstats.chunks['themes/default/js/search_plugin'].map(x => x.path);

    t.true(files[0].startsWith('/usr/src/app'));
    t.end();
  });
});

/*
test.cb('plugin should read the RETAILIFY_WEBPACK_STATS_ABSPATH environment variable', t => {
  console.log("Test 2");
  const testpath = '/bla/blub/blub/bla';
  process.env.RETAILIFY_WEBPACK_STATS_ABSPATH = testpath;
  webpack(optionsEnvabsPath, function (err, stats) {
    if (err) {
      return t.end(err);
    } else if (stats.hasErrors()) {
      return t.end(stats.toString());
    }

    const wpstats = require('./assets/bundles/envabspath/webpack-stats.json');
    const files = wpstats.chunks['themes/default/js/search_plugin'].map(x => x.path);

    t.true(files[0].startsWith(testpath));
    t.end();
  });
});
*/

test.cb('plugin should use the path of the current directory', t => {
  const testpath = __dirname;
  process.env.RETAILIFY_WEBPACK_STATS_ABSPATH = '';
  webpack(optionsStandardPath, function (err, stats) {
    if (err) {
      return t.end(err);
    } else if (stats.hasErrors()) {
      return t.end(stats.toString());
    }

    const wpstats = require('./assets/bundles/standardpath/webpack-stats.json');
    const files = wpstats.chunks['themes/default/js/search_plugin'].map(x => x.path);

    t.true(files[0].startsWith(testpath));
    t.end();
  });
});
