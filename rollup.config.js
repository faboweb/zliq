import nodeResolve from 'rollup-plugin-node-resolve';
import jsx from 'rollup-plugin-jsx';
import commonjs from 'rollup-plugin-commonjs';
import typescript from 'rollup-plugin-typescript';

export default {
    entry: './src/index.tsx',
    sourceMap: true,

    plugins: [
        jsx( {factory: 'h'} ),
        nodeResolve({
            jsnext: true, 
            main: true,
            browser: true,
            extensions: [ '.js', '.json', '.ts', '.tsx' ]
        }),
        commonjs(),
        typescript()
    ]
}