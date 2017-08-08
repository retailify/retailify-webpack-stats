import test from 'ava';
import webpack from 'webpack';
let options = require('./examples/webpack.config');


test.cb('webpack-stats.json should contain a file path, which starts with /usr/src/app', t => {
  webpack(options, function(err, stats) {
    if (err) {
      return t.end(err);
    } else if (stats.hasErrors()) {
      return t.end(stats.toString());
    }

    var wpstats = require('./assets/webpack-stats.json');
    const files = wpstats.chunks['themes/default/js/search_plugin'].map(x => x.path);

    t.true(files[0].startsWith('/usr/src/app'));
    t.end();
  });
});
