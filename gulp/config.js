/**
 * Configuration file for the gulp tasks.
 *
 * @author Marius Olbertz
 * @version 0.1
 */
module.exports = {
  name: 'contextMenu',
  srcPath: 'src',
  destPath: 'dist',
  buildPath: 'build',
  pluginPath: 'build',
  foundationPath: 'node_modules/foundation-sites',
  css: {
    compatibility: ['last 2 versions', 'ie 10', 'Android >= 4.1'], // compatibility for auto prefixer
    components: [
      //'typography',
      'menu',
      'dropdown-menu'
    ]
  },
  javascript: {
    dependencies: [ // define JS dependencies for this project to concat
      'node_modules/foundation-sites/js/foundation.core.js',
      'node_modules/foundation-sites/js/foundation.util.*.js',
      'node_modules/foundation-sites/js/foundation.dropdownMenu.js',
      'dist/js/foundation.contextMenu.js'
    ]
  }
};