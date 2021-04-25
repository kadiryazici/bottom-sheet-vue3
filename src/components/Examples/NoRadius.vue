<template>
   <h4 class="text-left">No Radius</h4>
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
   <Sheet radius="0px" v-model:visible="isOpen">
      I have no radius
      <br />
      <a
         href="https://github.com/kadiryazici/bottom-sheet-vue3"
         target="_blank"
      >
         github page if you wanna check
      </a>
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

   <Sheet radius="0px" v-model:visible="isOpen">
      I have no radius
      <br />
      <a href="https://github.com/kadiryazici/bottom-sheet-vue3" target="_blank">
         github page if you wanna check
      </a>
   </Sheet>
</template>

<script setup>
import { Sheet } from 'vue3-bottom-sheet';
ref: isOpen = false;
<\/script>
`;
</script>
