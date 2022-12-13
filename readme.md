# Bottom-Sheet-Vue3

A touch-supported bottom sheet library for Vue 3

## Installation
```
pnpm install bottom-sheet-vue3
```
```
yarn install bottom-sheet-vue3
```
```
npm install bottom-sheet-vue3
```

## Usage
Import css and register plugin. Plugin is **needed**.

```ts
import { createBottomSheet } from 'bottom-sheet-vue3'
import { createApp } from 'vue'

import 'bottom-sheet-vue3/style.css'
import App from './App.vue'

const app = createApp(App)
app.use(createBottomSheet())
app.mount('#app')
```

Sheet is just a single component with slots/options support. It teleports itself to body so you can use it anywhere you want.

```html
<script lang="ts" setup>
import { ref } from 'vue'
import { Sheet } from 'bottom-sheet-vue3'

const visible = ref(false)
</script>

<template>
  <button @click="visible = true">
    Click to show sheet
  </button>

  <Sheet v-model:visible="visible">
    Hello this is Sheet Content
  </Sheet>
</template>
```

#### Custom Header
You can set custom header if you don't want default line header.

```html
<script lang="ts" setup>
import { ref } from 'vue'
import { Sheet } from 'bottom-sheet-vue3'

const visible = ref(false)
</script>

<template>
  <button @click="visible = true">
    Click to show sheet
  </button>

  <Sheet v-model:visible="visible">
    Hello this is Sheet Content

    <template #header>
      <SomeComponent />
    </template>
  </Sheet>
</template>
```

## Props
```ts
interface Props {
  /**
   * @description Minimum swipe down pixel count for sheet to close itself
   *
   * @default { 100 }
   */
  threshold: number

  /**
   * @description By default sheet listens swipe on screen, if
   *              this prop given it will listen only header.
   *
   * @default { false }
   */
  onlyHeaderSwipe: boolean

  /**
   * @description By default sheet stretches itself up over-swipe,
   *              this prop disables it
   *
   * @default { false }
   */
  noStretch: boolean

  /**
   * @description If given Sheet won't close itself on click outside
   *
   * @default { false }
   */
  noClickOutside: boolean

  /**
   * @description Removes header section, ignores #header slot
   *
   * @default { false }
   */
  noHeader: boolean

  /**
   * @description Handles sheet visibility, should be used as `v-model:visible`.
   */
  visible: boolean
}
```

## Styling Sheet
You can directly change css properties but Sheet provides some css variables for you to override default ones.

- --bottom-sheet-backdrop-background-color
  - **`@default`** rgba(0, 0, 0, 0.2)

- --bottom-sheet-max-width
  - **`@default`** 500px

- --bottom-sheet-bakground-color
  - **`@default`** #fff

- --bottom-sheet-min-width
  - **`@default`** 40%

- --bottom-sheet-max-height
  - **`@default`** 60%

- --bottom-sheet-border-radius
  - **`@default`** 15px 15px 0px 0px

- --bottom-sheet-header-bar-background-color
  - **`@default`** rgb(88, 88, 88)

- --bottom-sheet-header-bar-border-radius
  - **`@default`** 10px