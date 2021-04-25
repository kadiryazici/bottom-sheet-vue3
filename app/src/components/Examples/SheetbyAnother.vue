<template>
   <h4 class="text-left">Open Sheet by Another Sheet</h4>
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

   <Sheet v-model:visible="isOpen">
      <button class="btn btn-primary" @click="isOtherOpen = true">
         open other sheet
      </button>
   </Sheet>

   <Sheet v-model:visible="isOtherOpen">
      <h2 class="text-center">Hi this is other sheet</h2>
   </Sheet>
</template>

<script lang="ts" setup>
import { Sheet } from '/slideComponent/index';
ref: isOpen = false;
ref: isOtherOpen = false;

ref: sampleCode = `\
<template>
   <button @click=" isOpen = true ">
      Open Sheet
   </button>

   <Sheet v-model:visible="isOpen">
      <button @click="isOtherOpen = true">open other sheet</button>
   </Sheet>

   <Sheet v-model:visible="isOtherOpen">
      <h2 class="text-center">Hi this is other sheet</h2>
   </Sheet>
</template>

<script setup>
import { Sheet } from 'vue3-bottom-sheet';
ref: isOpen = false;
ref: isOtherOpen = false;
<\/script>
`;
</script>
