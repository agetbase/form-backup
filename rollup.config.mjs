import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/index.js',
        format: 'cjs',
        sourcemap: true,
        exports: 'named',
      },
      {
        file: 'dist/index.mjs',
        format: 'es',
        sourcemap: true,
      },
    ],
    plugins: [
      typescript({
        tsconfig: './tsconfig.json',
        declaration: true,
        declarationDir: './dist',
        outDir: './dist',
      }),
    ],
  },

  {
    input: 'src/index.ts',
    output: {
      file: 'dist/browser.global.js',
      format: 'iife',
      name: 'FormBackup',
      sourcemap: true,
    },
    plugins: [
      typescript({
        tsconfig: './tsconfig.json',
        declaration: false,
        outDir: './dist',
      }),
    ],
  },

  {
    input: 'src/index.ts',
    output: {
      file: 'dist/browser.global.min.js',
      format: 'iife',
      name: 'FormBackup',
      sourcemap: true,
    },
    plugins: [
      typescript({
        tsconfig: './tsconfig.json',
        declaration: false,
        outDir: './dist',
      }),
      terser({
        compress: {
          drop_console: true,
        },
      }),
    ],
  },
];
