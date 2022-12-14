import { nodeResolve } from '@rollup/plugin-node-resolve';
import { babel } from '@rollup/plugin-babel';
import { uglify } from 'rollup-plugin-uglify';

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/index.js',
    format: 'cjs'
  },
  plugins: [nodeResolve({
    resolveOnly: mod => mod.startsWith('@internal'),
  }), babel({
    exclude: 'node_modules/**',
    babelHelpers: 'bundled'
  }), uglify()],
};