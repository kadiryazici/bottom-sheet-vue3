import { UserConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

const config: UserConfig = {
   plugins: [vue()],
   cssPreprocessOptions: {
      scss: {
         additionalData: `
            // @use "src/scss/vars";
         `,
      },
   },
   optimizeDeps: {
      include: [
         'highlight.js/lib/core',
         'highlight.js/lib/languages/javascript',
         'highlight.js/lib/languages/xml',
         'highlight.js/lib/languages/typescript',
      ],
   },
   outDir: './docs',
};

export default config;
