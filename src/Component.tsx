/* eslint-disable vue/one-component-per-file */

import { type PropType, Teleport, Transition, defineComponent, onMounted, onUnmounted, ref, watch } from 'vue'
import { SHEET_PROPS, STOP_ATTR } from './constants'
import { useBottomSheet } from './plugin'
import { withEventModifiers } from './utils'

const SheetRenderer = defineComponent({
  name: 'SheetRenderer',
  props: {
    ...SHEET_PROPS,
    id: {
      type: Number as PropType<number>,
      required: true,
    },
  },
  emits: {
    updateElement: null! as (el: HTMLDivElement | null) => void,
    close: null! as () => void,
  },
  setup(props, { emit, slots }) {
    const context = useBottomSheet()

    const element = ref<HTMLDivElement>(null!)

    onUnmounted(() => emit('updateElement', null))

    let listenBackdropClick = true

    const handleClickBackdrop = withEventModifiers(() => {
      if (
        props.noClickOutside
        || !listenBackdropClick
      )
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

      if (swipedPixels.value < 0 && !props.noStretch) {
        element.value.style.setProperty('height', `${preSwipeHeight + Math.abs(swipedPixels.value)}px`)
        element.value.style.setProperty('max-height', 'none')
      }
      else {
        element.value.style.removeProperty('height')
        element.value.style.removeProperty('max-height')
      }
    }

    function handleSwipeStart(e: MouseEvent | TouchEvent) {
      if (e.target instanceof HTMLElement && e.target.closest(`[${STOP_ATTR}]`))
        return

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

    function handleHeaderSwipeStart(e: MouseEvent | TouchEvent) {
      if (props.onlyHeaderSwipe)
        handleSwipeStart(e)
    }

    function handleBackdropSwipeStart(e: MouseEvent | TouchEvent) {
      if (!props.onlyHeaderSwipe)
        handleSwipeStart(e)
    }

    const globalEvents = [
      ['resize', reset],
      ['resize', syncHeight],
      ['mousemove', handleSwipe],
      ['mouseup', handleSwipeEnd],
      ['touchend', handleSwipeEnd],
      ['touchcancel', handleSwipeEnd],
      ['touchmove', handleSwipe],
    ] as [keyof WindowEventMap, () => any][]

    onMounted(() => {
      syncHeight()

      for (const [name, fn] of globalEvents)
        window.addEventListener(name, fn)
    })

    onUnmounted(() => {
      for (const [name, fn] of globalEvents)
        window.removeEventListener(name, fn)
    })

    return () => (
      <div
        class="bottom-sheet-backdrop"
        data-sheet-active={props.id === context.activeSheet.value ? '' : null}
        draggable={false}
        onClick={handleClickBackdrop}
        onMousedown={handleBackdropSwipeStart}
        onTouchstart={handleBackdropSwipeStart}
      >
        <div
          ref={element}
          class="bottom-sheet"
          data-swiping={swiping.value ? '' : null}
          style={{
            transform: `translateY(${Math.max(swipedPixels.value, 0)}px)`,
          }}
        >
          {
            props.noHeader
              ? null
              : (
                  <div
                    onMousedown={handleHeaderSwipeStart}
                    onTouchstart={handleHeaderSwipeStart}
                    class="bottom-sheet-header"
                  >
                    {
                      slots.header
                        ? slots.header()
                        : <div class="bottom-sheet-header-bar" />
                    }
                  </div>
                )
          }
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

    let oldId = context.activeSheet.value

    watch(() => props.visible, (visible) => {
      if (visible) {
        oldId = context.activeSheet.value
        context.activeSheet.value = id
      }
      else {
        context.activeSheet.value = oldId
      }
    }, { immediate: true })

    function handleClose() {
      emit('update:visible', false)
    }

    function handleAnimationEnter(backdrop: Element, done: () => void) {
      const sheetEl = backdrop.querySelector('.bottom-sheet')!
      const currentBackground = window.getComputedStyle(backdrop).backgroundColor

      backdrop.animate(
        [
          { backgroundColor: 'rgba(0, 0, 0, 0)' },
          { backgroundColor: currentBackground },
        ],
        {
          duration: 300,
          easing: 'ease',
        },
      )

      const anim = sheetEl.animate(
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

    function handleAnimationLeave(backdrop: Element, done: () => void) {
      const sheetEl = backdrop.querySelector('.bottom-sheet')!

      backdrop.animate(
        [{ backgroundColor: 'rgba(0, 0, 0, 0)' }],
        {
          duration: 300,
          easing: 'ease',
        },
      )

      const anim = sheetEl.animate(
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

    onUnmounted(() => {
      context.activeSheet.value = oldId
    })

    return () => (
      <Teleport to="body">
        <Transition
          css={false}
          onEnter={
            props.handleAnimationEnter === null
              ? undefined
               : props.handleAnimationEnter || handleAnimationEnter
          }
          onLeave={
            props.handleAnimationLeave === null
              ? undefined :
              props.handleAnimationLeave || handleAnimationLeave
          }
        >
          { props.visible && (
            <SheetRenderer
              id={id}
              v-slots={slots}
              onClose={handleClose}
              {...attrs}
              noClickOutside={props.noClickOutside}
              noHeader={props.noHeader}
              noStretch={props.noStretch}
              onlyHeaderSwipe={props.onlyHeaderSwipe}
              threshold={props.threshold}
            />
          )}
        </Transition>
      </Teleport>
    )
  },
})
