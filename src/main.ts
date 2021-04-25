import { createApp } from 'vue';
import App from './App.vue';
// @ts-ignore
import hljs from 'highlight.js/lib/core';
// @ts-ignore
import hljsJS from 'highlight.js/lib/languages/javascript';
// @ts-ignore
import hljsXML from 'highlight.js/lib/languages/xml';
// @ts-ignore
import hljsTS from 'highlight.js/lib/languages/typescript';
import HightlightVue from '/src/components/Highlight.vue';
import 'highlight.js/styles/atom-one-dark.css';
import '/slideComponent/css/style.css';

const vueHighlight = {
   subLanguage: 'xml',
   contains: [
      hljs.COMMENT('<!--', '-->', {
         relevance: 10,
      }),
      {
         begin: /^(\s*)(<script>)/gm,
         end: /^(\s*)(<\/script>)/gm,
         subLanguage: 'javascript',
         excludeBegin: true,
         excludeEnd: true,
      },
      {
         begin: /^(\s*)(<script lang=["']ts["']>)/gm,
         end: /^(\s*)(<\/script>)/gm,
         subLanguage: 'typescript',
         excludeBegin: true,
         excludeEnd: true,
      },
   ],
};
const useVueHighlight = () => vueHighlight;
hljs.registerLanguage('vue', useVueHighlight);
hljs.registerLanguage('javascript', hljsJS);
hljs.registerLanguage('js', hljsJS);
hljs.registerLanguage('html', hljsXML);
hljs.registerLanguage('xml', hljsXML);
hljs.registerLanguage('typescript', hljsTS);
hljs.registerLanguage('ts', hljsTS);

const app = createApp(App);

app.component('hljs', HightlightVue);

app.directive('highlightjs', (el, binding) => {
   const codeNodes = el.querySelectorAll('code') as Array<HTMLElement>;

   for (let i = 0; i < codeNodes.length; i++) {
      const codeNode = codeNodes[i];

      if (typeof binding.value === 'string') {
         codeNode.textContent = binding.value;
      }
      // @ts-ignore
      hljs.highlightElement(codeNode);
   }
});

app.mount('#app');
