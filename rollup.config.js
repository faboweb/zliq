import nodeResolve from 'rollup-plugin-node-resolve';
import jsx from 'rollup-plugin-jsx';
import commonjs from 'rollup-plugin-commonjs';
import typescript from 'rollup-plugin-typescript';
import sass from 'rollup-plugin-sass';
import serve from 'rollup-plugin-serve';

export default {
    entry: './src/index.tsx',
    sourceMap: true,

    plugins: [
        sass(),
        jsx( {factory: 'h'} ),
        nodeResolve({
            jsnext: true,
            main: true,
            browser: true,
            extensions: [ '.js', '.json', '.ts', '.tsx' ]
        }),
        commonjs(),
        typescript(),
        serve({
            // Folder to serve files from,
            contentBase: './dist',

            // Set to true to return index.html instead of 404
            historyApiFallback: true,

            // Options used in setting up server
            host: 'localhost',
            port: 8080
        })
    ]
}