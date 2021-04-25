<template>
   <h4 class="text-left">Custom Dimensions</h4>
   <div class="row">
      <div class="col-md">
         <hljs t="vue">{{ sampleCode }}</hljs>
      </div>
      <div class="col-md">
         <button @click="isOpen = true" class="btn btn-primary">
            Open Sheet
         </button>
      </div>
   </div>
   <Sheet maxWidth="850px" height="100%" v-model:visible="isOpen">
      <p>
         you can play with dimensions easily
         <br />
         height: 100% means rise till end but maxWidth:90% by default :)
      </p>
   </Sheet>
</template>

<script lang="ts" setup>
import { Sheet } from '/slideComponent/index';
import { h } from 'vue';
ref: isOpen = false;
ref: customIcon = h('div', { class: 'material-icons' }, 'menu');

ref: sampleCode = `\
<template>
   <button @click=" isOpen = true ">
      Open Sheet
   </button>

   <Sheet maxWidth="850px" height="100%" v-model:visible="isOpen">
      <p>
         you can play with dimensions easily
         <br>
         height: 100% means rise till end but maxWidth:90% by default :)
      </p>
   </Sheet>
</template>

<script setup>
import { Sheet } from 'bottom-sheet-vue3';
ref: isOpen = false;
<\/script>
`;
</script>
