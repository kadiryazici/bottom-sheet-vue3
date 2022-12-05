import { type InjectionKey, type Plugin, inject, reactive, watch } from 'vue'
import { BG_ACTIVE_ATTR, BG_CLASS } from './constants'
import { isBrowser } from './utils'

export interface IOnSwipeContext {
  /**
   * Amount of pixels swiped can be negative to stretch it
   */
  swipePx: number
}

export interface IPluginContext {
  /**
   * Reactive
   */
  activeSheets: Set<symbol>
  id(): symbol
}

const injectionKey: InjectionKey<IPluginContext> = Symbol('BottomSheet')

export function createBottomSheet(): Plugin {
  let background: null | HTMLDivElement = null

  if (isBrowser()) {
    const foundBg = document.querySelector<HTMLDivElement>(`.${BG_CLASS}`)

    if (foundBg) {
      background = foundBg
    }
    else {
      background = document.createElement('div')
      background.className = BG_CLASS
      document.body.appendChild(background)
    }
  }

  const activeSheets = reactive<Set<symbol>>(new Set())

  watch(() => activeSheets.size, (size) => {
    if (background) {
      if (size > 0)
        background.setAttribute(BG_ACTIVE_ATTR, 'true')
      else
        background.removeAttribute(BG_ACTIVE_ATTR)
    }
  })

  const context: IPluginContext = {
    activeSheets,
    id: () => Symbol('SheetID'),
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
