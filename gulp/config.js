/**
 * Configuration file for the gulp tasks.
 *
 * @author Marius Olbertz
 * @version 0.1
 */
module.exports = {
  name: 'contextMenu',
  srcPath: '',
  destPath: 'dist/',
  buildPath: '_build/',
  pluginPath: '_build/',
  testPath: 'test/visual/',
  foundationPath: 'node_modules/foundation-sites',
  css: {
    compatibility: ['last 2 versions', 'ie 10', 'Android >= 4.1'], // compatibility for auto prefixer
    components: [
      'menu',
      'dropdown-menu'
    ]
  },
  javascript: {
    dependencies: [ // define JS dependencies for this project to concat
      'node_modules/foundation-sites/dist/plugins/foundation.core.js',
      'node_modules/foundation-sites/dist/plugins/foundation.util.*.js',
      'node_modules/foundation-sites/dist/plugins/foundation.dropdownMenu.js'
    ]
  }
};