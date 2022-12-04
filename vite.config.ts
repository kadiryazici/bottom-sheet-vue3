
import path from 'path';
import Vue from '@vitejs/plugin-vue';
import { defineConfig, type UserConfigExport } from 'vite';

const devConfig: UserConfigExport = {
  plugins: [
    Vue(),
  ],
  root: './playground',
};

const prodConfig: UserConfigExport = {
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src', 'index.ts'),
      name: 'BottomSheetVue3',
      fileName: 'index',
      formats: ['cjs', 'es'],
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
};

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  if (mode === 'production') return prodConfig;
  if (mode === 'development') return devConfig;
  if (mode === 'staging') return { ...devConfig, base: '/bottom-sheet-vue3/' };

  throw new Error('Invalid mode');
});
