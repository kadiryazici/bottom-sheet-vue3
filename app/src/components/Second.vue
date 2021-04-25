<template>
   <div class="_main mx-auto">
      <h3 class="text-center">Options & Default Options</h3>
      <p class="text-justify">
         <span>
            <span class="text-primary" v-text="'<Sheet/>'"></span>
            component has some options. You can change it's behavior and visual
            by options.
            <br />
            <hljs t="ts">{{ OptionsCode }}</hljs>
         </span>
      </p>
   </div>
</template>

<script lang="ts" setup>
ref: OptionsCode = `\
/**
 * @description User should give valid css value.
 */
type CSS_String = string;

type optionProps = {
   // min height of sheet
   minHeight: {
      default: '250px',
      type: CSS_String
   },
   // maxwidth of sheet, it will be full width if lower than value
   maxWidth: {
      default: '500px',
      type: CSS_String
   },
   // max height of sheet.
   maxHeight: {
      default: '90%',
      type: CSS_String
   },
   // if you change this to a value, sheet will be same height.
   // but minHeight is more important for css.
   height: {
      default: 'auto',
      type: CSS_String
   },
   slideIcon: {
      default: h('div', { class: 'vier-head-icon'}),
      type: vNode
   },
   // background color of container 
   containerColor: {
      default: 'rgba(0,0,0,.5)',
      type: CSS_String
   },
   // background color of sheet
   sheetColor: {
      default: '#fff',
      type: CSS_String
   },
   // if user uses default slide icon, change it's color
   sliderIconColor: {
      default: 'rgba(0, 0, 0, 0.416)',
      type: CSS_String
   },
   // top corners radius of sheet
   radius: {
      default: '25px',
      type: CSS_String
   },
   // how much pixel slide required to close sheet.
   threshold: {
      default: 50
      type: number
   },
   // if true, sheet will be closed when clicked outside.
   clickOutside: {
      default: true
      type: boolean
   }
};
`;
</script>
