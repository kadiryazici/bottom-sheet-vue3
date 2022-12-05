/* eslint-disable vue/one-component-per-file */

import { Teleport, Transition, defineComponent, onMounted, onUnmounted, ref, watch } from 'vue'
import { BG_CLASS, SHEET_EMITS, SHEET_PROPS, STOP_ATTR } from './constants'
import { useBottomSheet } from './plugin'
import { withEventModifiers } from './utils'

const SheetRenderer = defineComponent({
  name: 'SheetRenderer',
  props: SHEET_PROPS,
  emits: SHEET_EMITS,
  setup(props, { emit, slots }) {
    const element = ref<HTMLDivElement>(null!)

    onUnmounted(() => emit('updateElement', null))

    let listenBackdropClick = true

    const handleClickBackdrop = withEventModifiers((e: MouseEvent) => {
      if (
        !listenBackdropClick
        || (e.target instanceof HTMLElement && e.target.closest(`.${STOP_ATTR}`)))
        return

      emit('close')
    }, ['self'])

    const swiping = ref(false)
    const swipedPixels = ref(0)
    const swipeStartY = ref(0)

    let swipeStarted = false
    let preSwipeHeight = 0

    function syncHeight() {
      preSwipeHeight = element.value.getBoundingClientRect().height
    }

    function reset() {
      element.value?.style.removeProperty('height')
      element.value?.style.removeProperty('max-height')

      preSwipeHeight = 0
      swiping.value = false
      swipedPixels.value = 0
      swipeStartY.value = 0
    }

    function handleSwipe(e: MouseEvent | TouchEvent) {
      if (!swipeStarted)
        return

      let clientY: number

      if ('touches' in e)
        clientY = e.touches[0].clientY
      else
        clientY = e.clientY

      if (clientY === swipeStartY.value) {
        swiping.value = false
        return
      }

      swiping.value = true
      swipedPixels.value = clientY - swipeStartY.value
      listenBackdropClick = false

      if (swipedPixels.value < 0) {
        element.value.style.setProperty('height', `${preSwipeHeight + Math.abs(swipedPixels.value)}px`)
        element.value.style.setProperty('max-height', 'none')
      }
      else {
        element.value.style.removeProperty('height')
        element.value.style.removeProperty('max-height')
      }
    }

    function handleSwipeStart(e: MouseEvent | TouchEvent) {
      if ('touches' in e) {
        swipeStartY.value = e.touches[0].clientY
        e.preventDefault()
      }
      else {
        swipeStartY.value = e.clientY
      }

      swipeStarted = true
    }

    function handleSwipeEnd() {
      if (!swipeStarted)
        return

      if (swipedPixels.value >= props.threshold) {
        emit('close')
      }
      else {
        setTimeout(() => {
          listenBackdropClick = true

          const anim = element.value?.animate(
            [{ height: `${preSwipeHeight}px` }],
            {
              duration: 200,
              easing: 'ease',
            },
          )

          anim?.addEventListener('finish', () => {
            element.value.style.removeProperty('height')
            element.value.style.removeProperty('max-height')
          })
        })
      }

      swiping.value = false
      swipeStartY.value = 0
      swipedPixels.value = 0
      swipeStarted = false
    }

    const globalEvents = [
      ['resize', reset],
      ['resize', syncHeight],
      ['mousemove', handleSwipe],
      ['mouseup', handleSwipeEnd],
      ['touchmove', handleSwipe],
      ['touchstart', handleSwipeStart],
    ] as [keyof WindowEventMap, () => any][]

    onMounted(() => {
      syncHeight()
      globalEvents.forEach(([name, fn]) => {
        window.addEventListener(name, fn)
      })
    })

    onUnmounted(() => {
      globalEvents.forEach(([name, fn]) => {
        window.removeEventListener(name, fn)
      })
    })

    return () => (
      <div
      class="bottom-sheet-backdrop"
      onClick={handleClickBackdrop}
      onMousedown={handleSwipeStart}
      onTouchstart={handleSwipeStart}
      >
        <div
          ref={element}
          class="bottom-sheet"
          data-swiping={swiping.value || null}
          style={{
            transform: `translateY(${Math.max(swipedPixels.value, 0)}px)`,
          }}
        >
          <div class="bottom-sheet-header">
            <div class="bottom-sheet-header-bar" />
          </div>
          <div class="bottom-sheet-body">
            {slots.default?.()}
          </div>
        </div>
      </div>
    )
  },
})

export const Sheet = defineComponent({
  name: 'Sheet',
  inheritAttrs: false,
  props: {
    ...SHEET_PROPS,
    visible: {
      type: Boolean,
      required: true,
    },
  },
  emits: {
    'update:visible': null! as (visible: boolean) => void,
  },
  setup(props, { attrs, slots, emit }) {
    const context = useBottomSheet()
    const id = context.id()

    watch(() => props.visible, (visible) => {
      if (visible)
        context.activeSheets.add(id)
      else
        context.activeSheets.delete(id)
    }, { immediate: true })

    function handleClose() {
      emit('update:visible', false)
    }

    function handleAnimationEnter(el: Element, done: () => void) {
      const anim = el.animate(
        [
          { transform: 'translateY(100%)' },
          { transform: 'translateY(0%)' },
        ],
        {
          duration: 300,
          easing: 'ease',
        },
      )

      anim.onfinish = done
    }

    function handleAnimationLeave(el: Element, done: () => void) {
      const anim = el.animate(
        [
          { transform: 'translateY(100%)' },
        ],
        {
          duration: 300,
          easing: 'ease',
        },
      )

      anim.onfinish = done
    }

    return () => (
      <Teleport to={`.${BG_CLASS}`}>
        <Transition
          css={false}
          onEnter={handleAnimationEnter}
          onLeave={handleAnimationLeave}
        >
          { props.visible && (
            <SheetRenderer
              {...props}
              {...attrs}
              v-slots={slots}
              onClose={handleClose}
            />
          )}
        </Transition>
      </Teleport>
    )
  },
})
