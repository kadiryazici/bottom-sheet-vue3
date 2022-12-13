import { createApp } from 'vue'
import { createBottomSheet } from '../src'
import App from './App.vue'
import '../src/style.scss'

createApp(App)
  .use(createBottomSheet())
  .mount('#app')
