import { type InjectionKey, type Plugin, type Ref, inject, ref } from 'vue'

export interface IPluginContext {
  /**
   * Reactive
   */
  activeSheet: Ref<number>
  id(): number
}

const injectionKey: InjectionKey<IPluginContext> = Symbol('BottomSheet')

export function createBottomSheet(): Plugin {
  const activeSheet = ref<number>(-1)
  let lastId = 0

  const context: IPluginContext = {
    activeSheet,
    id: () => ++lastId,
  }

  return {
    install(app) {
      app.provide(injectionKey, context)
    },
  }
}

export function useBottomSheet() {
  return inject(injectionKey)!
}
