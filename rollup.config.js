const babel = require('rollup-plugin-babel');

export default [{
  input: 'src/js/bg.js',
  output: {
    format: 'iife',
    file: 'dist/bg.js'
  },
  plugins: [babel()]
}, {
  input: 'src/js/popup.js',
  output: {
    format: 'iife',
    file: 'dist/popup.js'
  },
  plugins: [babel()]
}];
