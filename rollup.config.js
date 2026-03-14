import { terser } from 'rollup-plugin-terser';

export default [
  {
    input: 'src/index.js',
    output: {
      file: 'dist/index.mjs',
      format: 'esm',
      sourcemap: false,
      inlineDynamicImports: true
    },
    plugins: [terser()]
  },
  {
    input: 'src/index.js',
    output: {
      file: 'dist/index.cjs',
      format: 'cjs',
      sourcemap: false,
      inlineDynamicImports: true
    },
    plugins: [terser()]
  },
  {
    input: 'src/component/index.js',
    output: {
      file: 'dist/marked-anx-component.cjs',
      format: 'cjs',
      sourcemap: false,
      inlineDynamicImports: true
    },
    plugins: [terser()]
  },
  {
    input: 'src/component/index.js',
    output: {
      file: 'dist/marked-anx-component.mjs',
      format: 'esm',
      sourcemap: false,
      inlineDynamicImports: true
    },
    plugins: [terser()]
  },
  {
    input: 'src/component/anx-element.js',
    output: {
      file: 'dist/anx-element.cjs',
      format: 'cjs',
      sourcemap: false,
      inlineDynamicImports: true
    },
    plugins: [terser()]
  },
  {
    input: 'src/component/anx-element.js',
    output: {
      file: 'dist/anx-element.mjs',
      format: 'esm',
      sourcemap: false,
      inlineDynamicImports: true
    },
    plugins: [terser()]
  }
];
