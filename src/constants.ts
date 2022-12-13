import type { PropType } from 'vue'

export const STOP_ATTR = 'data-bottom-sheet-stop'

const BOOL_FALSE = {
  type: Boolean as PropType<boolean>,
  default: false,
} as const

export const SHEET_PROPS = {
  /** Minimum pixel for minimum swipe duration to close sheet */
  threshold: {
    type: Number as PropType<number>,
    default: 100,
  },
  /** By default sheet listens swipe on screen, if this prop given it will listen only header */
  onlyHeaderSwipe: BOOL_FALSE,
  /** By default sheet stretches itself up on over swipe, this prop disables it */
  noStretch: BOOL_FALSE,
  /** If given Sheet won't close itself on click outside */
  noClickOutside: BOOL_FALSE,
} as const
