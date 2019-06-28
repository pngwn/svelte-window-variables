import svelte from 'rollup-plugin-svelte';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import { attachToWindow } from '../index.js';

const production = !process.env.ROLLUP_WATCH;

export default {
  input: __dirname + '/src/main.js',
  output: {
    sourcemap: true,
    format: 'iife',
    name: 'app',
    file: __dirname + '/public/bundle.js',
  },
  plugins: [
    svelte({
      preprocess: attachToWindow(true, 'boom'),
      dev: !production,
      css: css => {
        css.write('public/bundle.css');
      },
    }),
    resolve({ browser: true }),
    commonjs(),
  ],
  watch: {
    clearScreen: false,
  },
};
