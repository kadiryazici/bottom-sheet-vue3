import type { PropType } from 'vue'

export const STOP_ATTR = 'data-bottom-sheet-stop'
export const BG_ACTIVE_ATTR = 'data-background-active'
export const BG_CLASS = 'bottom-sheet-background'

export const SHEET_PROPS = {
  /** Minimum pixel for minimum swipe duration to close sheet */
  threshold: {
    type: Number as PropType<number>,
    default: 100,
  },
  /** If given Sheet won't close itself on click outside */
  noClickOutside: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
} as const

export const SHEET_EMITS = {
  updateElement: null as unknown as (el: HTMLDivElement | null) => void,
  close: null as unknown as () => void,
} as const
