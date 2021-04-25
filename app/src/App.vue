<template>
   <Navbar />
   <First />
   <Second />
   <Third />
</template>

<script lang="ts" setup>
import Navbar from '/src/components/Navbar.vue';
import First from '/src/components/First.vue';
import Second from '/src/components/Second.vue';
import Third from '/src/components/Third.vue';
</script>

<style lang="scss">
body,
html,
#app {
   width: 100%;
   min-height: 100%;
}

#app {
   padding-top: 80px;
   // padding-bottom: 40px;
   display: flex;
   align-content: center;
   flex-flow: column nowrap;
   padding-left: 15px;
   padding-right: 15px;
}

* {
   margin: 0;
   padding: 0;
   box-sizing: border-box;
}

._main {
   max-width: 1000px;
   width: 100%;
   margin-bottom: 20px;
}
</style>
