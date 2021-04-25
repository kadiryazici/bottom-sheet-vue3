<template>
   <nav class="fixed-top navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container-fluid">
         <a class="navbar-brand" href="#">{{ name }}</a>
         <form class="d-flex">
            <a target="_blank" :href="repoLink" class="btn btn-light">
               <Github />
            </a>
         </form>
      </div>
   </nav>
</template>

<script lang="ts" setup>
import Github from './Github.vue';

ref: a = true;
ref: repoLink = 'https://github.com/kadiryazici/bottom-sheet-vue3';
ref: name = 'Vue3 Bottom Sheet';
</script>
