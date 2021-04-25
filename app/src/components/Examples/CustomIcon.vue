<template>
   <h4 class="text-left">Custom Icon with Material Icons</h4>
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
   <Sheet :slideIcon="customIcon" v-model:visible="isOpen">
      <b>check the icon</b>
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

   <Sheet :slideIcon="customIcon" v-model:visible="isOpen">
      <b>check the icon</b>
   </Sheet>
</template>

<script setup>
import { Sheet } from 'vue3-bottom-sheet';
import { h } from 'vue';
import CustomIconComponent from './CustomIcon.vue';

ref: isOpen = false;
ref: customIcon = h('div', { class: 'material-icons' }, 'menu');

// you can use components by wrapping them with h
ref: customIcon = h(CustomIconComponent)
<\/script>
`;
</script>
