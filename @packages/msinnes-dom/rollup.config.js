import { nodeResolve } from '@rollup/plugin-node-resolve';
import { babel } from '@rollup/plugin-babel';
import { uglify } from 'rollup-plugin-uglify';
import sourcemaps from 'rollup-plugin-sourcemaps';


export default {
  input: 'src/index.js',
  output: {
    file: 'dist/index.js',
    sourcemap: true,
    format: 'cjs',
  },
  plugins: [nodeResolve(), babel({
    exclude: 'node_modules/**',
    babelHelpers: 'bundled'
  }), uglify(), sourcemaps()],
};