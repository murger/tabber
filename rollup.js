const rollup = require('rollup'),
    babel = require('rollup-plugin-babel'),
    plugins = [
        babel({ exclude: 'node_modules/**' })
    ];

rollup.rollup({
    input: 'src/js/bg.js',
    plugins: plugins
}).then(bundle => {
    bundle.write({
        format: 'iife',
        file: 'dist/bg.js'
    });
});

rollup.rollup({
    input: 'src/js/popup.js',
    plugins: plugins
}).then(bundle => {
    bundle.write({
        format: 'iife',
        file: 'dist/popup.js'
    });
});

console.log('Built bg.js & popup.js');
