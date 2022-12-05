<script lang="ts" setup>
import { ref } from 'vue'
import { Sheet } from '../src'

const visible = ref(false)
const second = ref(false)
</script>

<template>
  <button @click="(visible = true)">
    Click to show
  </button>

  <Sheet v-model:visible="visible">
    Hey how are you

    <button @click="(second = true)">
      Second
    </button>

    <Sheet v-model:visible="second">
      Secondos
    </Sheet>
  </Sheet>
</template>
