<template>
   <h4 class="text-left">Custom Threshold</h4>
   <p>
      Threshold controls how much pixel is required to close sheet by sliding.
      <br />
      Threshold should be <span class="text-danger">ALWAYS</span> number and
      assigned by vue.
   </p>
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
   <Sheet :threshold="150" v-model:visible="isOpen">
      <p>try to slide sheet by at least 150 pixels.</p>
      <p>don't forget default minHeight is 250px.</p>
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

   <Sheet :threshold="150" v-model:visible="isOpen">
      <p>
         try to slide sheet by at least 150 pixels.
      </p>
      <p>don't forget default minHeight is 250px.</p>
   </Sheet>
</template>

<script setup>
import { Sheet } from 'bottom-sheet-vue3';
ref: isOpen = false;
<\/script>
`;
</script>
