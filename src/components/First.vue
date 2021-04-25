<template>
   <div class="_main mx-auto">
      <h5 class="text-center">
         Welcome to the documentation of Vue 3 Bottom Sheet Component.
         <hr />
      </h5>

      <h3 class="text-center">About</h3>
      <p class="text-left">
         <span class="text-justify">
            This component has <span class="text-primary">types</span> support,
            so if you are using vue with typescript, you will have no issue with
            it.
            <br />
            This component uses
            <span class="text-primary">teleport</span> feature of vue3. Wherever
            you place this component, it will be last child of body.
         </span>
      </p>

      <h3 class="text-center">Installation & Usage</h3>
      <p class="text-justify">
         <span> First download it. </span>
         <hljs t="vue">{{ npm }}</hljs>
         <span>
            Usage is easy. Just import the component and done. No installation
            required, but you need to import css file in
            <span class="text-primary">main.ts or main.js</span>, otherwise
            styles and component's behavior will be broken because
            <span v-text="'<Sheet/>'" class="text-primary"></span> component is
            based on animation and transitions.
            <br />
            And, please do not inject custom style if you want it to work
            properly.
            <br />
            <hljs t="ts">{{ importCSSCode }}</hljs>
            This component is based on two way binding with
            <span class="text-primary">v-model:visible</span>
            User should bind
            <span class="text-primary">Boolean</span>
            value to make this component work.
            <br />
            And, don't worry, everything inside
            <span class="text-primary">{{'<Sheet />'}}</span>
            will be destroyed when sheet closed.
         </span>
      </p>
      <div class="row">
         <div class="col-md">
            <hljs t="vue">{{ usageCode }}</hljs>
         </div>
         <div class="col-md">
            <button @click="isOpen = true" class="btn btn-primary">
               Click Me Pleasseee
            </button>
         </div>
      </div>
   </div>
   <Sheet v-model:visible="isOpen">
      Hello I am inside of sheet :) Try to slide down or click outside.
   </Sheet>
</template>

<script lang="ts" setup>
import { Sheet } from '/slideComponent/index';

ref: isOpen = false;
ref: usageCode = `\
<template>
   <button @click=" isOpen = true ">
      Click Me Pleasseee
   </button>
   <Sheet v-model:visible=" isOpen ">
      Hello I am inside of sheet :) Try to slide down or click outside.
   </Sheet>
</template>

<script setup>
import { Sheet } from 'vue3-bottom-sheet';

ref: isOpen = false;
<\/script>
`;

ref: npm = `\
npm install vue3-bottom-sheet --save
or
yarn add vue3-bottom-sheet
`;

ref: importCSSCode = `\
// main.ts or main.js
import { createApp } from 'vue';
import App from './App.vue';
//import it
import 'vue3-bottom-sheet/css/style.css'
`;
</script>
