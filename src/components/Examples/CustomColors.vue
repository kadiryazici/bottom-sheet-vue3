<template>
   <h4 class="text-left">Custom Colors</h4>
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
   <Sheet
      sliderIconColor="#000"
      sheetColor="rgb(44, 44, 44)"
      containerColor="rgba(255, 255, 255, .5)"
      maxHeight="400px"
      v-model:visible="isOpen"
   >
      <div class="p-3 text-light text-center">
         <h3 v-for="n in 50">dark theme and check scroll</h3>
         bababoey
      </div>
   </Sheet>
</template>

<script lang="ts" setup>
import { Sheet } from '/slideComponent/index';
ref: isOpen = false;

ref: sampleCode = `\
<template>
   <button @click=" isOpen = true ">
      Open Sheet
   </button>

   <Sheet
      sliderIconColor="#000"
      sheetColor="rgb(44, 44, 44)"
      containerColor="rgba(255, 255, 255, .5)"
      v-model:visible="isOpen"
   >
      <div class="p-3 text-light">
         <h3 v-for="n in 50">dark theme and check scroll</h3>
      </div>
   </Sheet>
</template>

<script setup>
import { Sheet } from 'vue3-bottom-sheet';
ref: isOpen = false;
<\/script>
`;
</script>
