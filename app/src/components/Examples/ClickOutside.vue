<template>
   <h4 class="text-left">Disable Click Outside</h4>
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
   <Sheet :clickOutside="false" v-model:visible="isOpen"> try click out </Sheet>
</template>

<script lang="ts" setup>
import { Sheet } from '/slideComponent/index';
ref: isOpen = false;

ref: sampleCode = `\
<template>
   <button @click=" isOpen = true ">
      Open Sheet
   </button>

   <Sheet :clickOutside="false" v-model:visible="isOpen"> 
      try to click out 
   </Sheet>

</template>

<script setup>
import { Sheet } from 'bottom-sheet-vue3';
ref: isOpen = false;
<\/script>
`;
</script>
