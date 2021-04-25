import HightlightVue from '/src/components/Highlight.vue';

declare module 'vue' {
   interface GlobalComponents {
      hljs: typeof HightlightVue;
   }
}
