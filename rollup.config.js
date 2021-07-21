import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import image from '@rollup/plugin-image';
import typescript from '@rollup/plugin-typescript';
import livereload from 'rollup-plugin-livereload';
import path from 'path';

export default {
  input: ['src/SkhemataEditorQuill.ts', 'skhemata-editor-quill.ts', 'index.ts'],
  output: {
    dir: 'dist',
    format: 'es'
  },
  plugins: [
    commonjs(),
    typescript(),
    resolve(),
    image(),
    /*
    livereload({
	    delay: 500,
      watch: [
	      path.resolve(__dirname, 'dist'),
	      path.resolve(__dirname, 'src'),
      ]
    }),*/
  ]
};
