<template>
   <h4 class="text-left">Self Closable Slot</h4>
   <p>
      If you want to close sheet by another user action, you can just update ref
      value you created also you can use closeSelf function from v-slot.
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

   <Sheet v-slot="{ closeSelf }" v-model:visible="isOpen">
      <div class="text-center">
         <button class="btn btn-primary" @click="closeSelf()">Close</button>
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

   <Sheet v-slot="{ closeSelf }" v-model:visible="isOpen">
      <button @click="closeSelf()">Close</button>
   </Sheet>
</template>

<script setup>
import { Sheet } from 'bottom-sheet-vue3';
ref: isOpen = false;
<\/script>
`;
</script>
