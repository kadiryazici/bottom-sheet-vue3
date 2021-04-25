<template>
   <pre v-highlightjs><code :class="t"
      ><slot/></code
   ></pre>
</template>

<script lang="ts" setup>
import { defineProps } from '@vue/runtime-core';

defineProps<{
   t: string;
}>();
</script>
