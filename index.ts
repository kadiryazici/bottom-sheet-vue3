'use strict';

import {
   defineComponent,
   h,
   PropType,
   ref,
   onMounted,
   computed,
   watch,
   createVNode,
   isVNode,
   provide,
   InjectionKey,
   inject,
} from 'vue';

const defaultSlideIcon = createVNode('div', { class: 'vier-head-icon' });
const injectKey: InjectionKey<Props> = Symbol();

interface Props<S = string, N = number> {
   minHeight: S;
   maxWidth: S;
   maxHeight: S;
   height: S;
   slideIcon: any;
   containerColor: S;
   sheetColor: S;
   sliderIconColor: S;
   threshold: N;
   radius: S;
}

const options = {
   minHeight: {
      default: 'auto',
      type: String as PropType<string>,
   },
   maxWidth: {
      default: '500px',
      type: String as PropType<string>,
   },
   maxHeight: {
      default: '90%',
      type: String as PropType<string>,
   },
   height: {
      default: 'auto',
      type: String as PropType<string>,
   },
   slideIcon: {
      default: defaultSlideIcon,
      type: null,
   },
   containerColor: {
      default: 'rgba(0,0,0,.5)',
      type: String as PropType<string>,
   },
   sheetColor: {
      default: '#fff',
      type: String as PropType<string>,
   },
   sliderIconColor: {
      default: 'rgba(0, 0, 0, 0.416)',
      type: String as PropType<string>,
   },
   radius: {
      default: '25px',
      type: String as PropType<string>,
   },
   threshold: {
      type: Number as PropType<number>,
      default: 25,
   },
};

const SheetItem = defineComponent({
   name: 'VierSheetItem',
   emits: {
      hide: null,
      closeStart: null,
      canClose: null,
   },
   props: {
      shouldClose: {
         type: Boolean as PropType<boolean>,
         default: false,
      },
   },
   setup(props, { slots, emit }) {
      const sheet = ref<HTMLElement | null>(null);
      const sheetHead = ref<HTMLElement | null>(null);

      const yStart = ref(0);
      const yTotal = ref(0);

      const sheetBeginningTop = ref(0);

      onMounted(() => {
         if (sheet.value) {
            sheetBeginningTop.value = sheet.value.getBoundingClientRect().y;
            sheet.value.addEventListener('animationend', emitCanClose);
         }
         function emitCanClose() {
            emit('canClose');
            if (sheet.value) {
               sheet.value.removeEventListener('animationend', emitCanClose);
            }
         }
      });

      const transformY = ref(0);
      const transitionValue = 'transform .35s';
      const transition = ref('none');
      const style = computed(() => ({
         transform: `translateY(${transformY.value}px)`,
         transition: transition.value,
      }));

      function onTouchMouseDown(e: MouseEvent | TouchEvent) {
         e.preventDefault();
         transition.value = 'none';

         const iOfTouch = e instanceof TouchEvent;
         const iOfWTouch = e instanceof window.TouchEvent;
         if (e instanceof window.MouseEvent || e instanceof MouseEvent) {
            yStart.value = e.clientY;
         } else if (iOfTouch || iOfWTouch) {
            yStart.value = e.touches[0].clientY;
         }
         window.addEventListener('mousemove', onTouchMouseMove, {
            passive: false,
         });
         window.addEventListener('touchmove', onTouchMouseMove, {
            passive: false,
         });
         window.addEventListener('mouseup', onTouchMouseUp);
         window.addEventListener('touchend', onTouchMouseUp);
      }

      function onTouchMouseMove(e: MouseEvent | TouchEvent) {
         e.preventDefault();
         const iOfTouch = e instanceof TouchEvent;
         const iOfWTouch = e instanceof window.TouchEvent;
         if (e instanceof window.MouseEvent || e instanceof MouseEvent) {
            yTotal.value = Math.max(0, e.clientY - yStart.value);
            transformY.value = yTotal.value;
         } else if (iOfWTouch || iOfTouch) {
            yTotal.value = Math.max(0, e.touches[0].clientY - yStart.value);
            transformY.value = yTotal.value;
         }
      }

      function closeSheet() {
         const windowBottom = window.innerHeight;
         const targetPixel =
            sheetBeginningTop.value +
            (windowBottom - sheetBeginningTop.value + 25);
         transformY.value = targetPixel;
         transition.value = transitionValue;

         if (sheet.value) {
            sheet.value.addEventListener('transitionend', () => {
               emit('hide');
            });
         }
      }
      watch(
         () => props.shouldClose,
         newValue => {
            if (newValue) {
               closeSheet();
            }
         }
      );

      const _props = inject(injectKey)!;
      function onTouchMouseUp(e: MouseEvent | TouchEvent) {
         e.preventDefault();
         if (yTotal.value >= _props.threshold) {
            emit('closeStart');
         } else {
            transformY.value = 0;
            transition.value = transitionValue;
            yStart.value = 0;
            yTotal.value = 0;
         }

         window.removeEventListener('mousemove', onTouchMouseMove);
         window.removeEventListener('touchmove', onTouchMouseMove);
         window.removeEventListener('mouseup', onTouchMouseUp);
         window.removeEventListener('touchend', onTouchMouseUp);
      }
      return () =>
         h(
            'div',
            {
               class: 'vier-sheet',
               ref: sheet,
               style: style.value,
            },
            [
               h(
                  'div',
                  {
                     class: 'vier-sheet-head',
                     ref: sheetHead,
                     onMousedown: onTouchMouseDown,
                     onTouchstart: onTouchMouseDown,
                  },
                  [_props.slideIcon]
               ),
               h(
                  'div',
                  { class: 'vier-sheet-body' },
                  {
                     default: slots.default,
                  }
               ),
            ]
         );
   },
});

const SheetContainer = defineComponent({
   name: 'VierSheetContainer',
   inheritAttrs: false,
   emits: {
      closeSheet: () => true,
   },
   props: {
      shiftAttrs: {
         type: Object as PropType<Object>,
      },
      shouldWrapperClose: {
         type: Boolean as PropType<boolean>,
      },
   },

   setup(props, { attrs, slots, emit }) {
      const shouldClose = ref(false);
      const canClose = ref(false);
      watch(
         () => props.shouldWrapperClose,
         v => {
            if (v) {
               shouldClose.value = true;
            }
         }
      );
      const _props = inject(injectKey)!;
      const style = computed(() => ({
         '--container-color': _props.containerColor,
         '--sheet-color': _props.sheetColor,
         '--sheet-height': _props.height,
         '--sheet-max-height': _props.maxHeight,
         '--sheet-max-width': _props.maxWidth,
         '--sheet-min-height': _props.minHeight,
         '--sheet-radius': _props.radius,
         '--sheet-slider-icon-color': _props.sliderIconColor,
      }));

      return () => {
         return h(
            'div',
            {
               id: 'vier-sheet-container',
               onClick: (event: MouseEvent) => {
                  if (canClose.value) {
                     if (event.target !== event.currentTarget) return;
                     shouldClose.value = true;
                  }
               },
               style: style.value,
               class: `${shouldClose.value ? 'anim-out' : ''}`,
            },
            [
               h(
                  SheetItem,
                  {
                     ...props.shiftAttrs,

                     shouldClose: shouldClose.value,
                     onHide: () => {
                        emit('closeSheet');
                     },
                     onCloseStart: () => {
                        if (canClose.value) {
                           shouldClose.value = true;
                        }
                     },
                     onCanClose: () => (canClose.value = true),
                  },
                  {
                     default: slots.default,
                  }
               ),
            ]
         );
      };
   },
});

export const Sheet = defineComponent({
   name: 'VierSheet',
   props: {
      visible: {
         type: Boolean as PropType<boolean>,
         required: true,
      },
      ...options,
   },
   emits: {
      'update:visible': (value: boolean) => true,
   },
   setup(props, { emit, slots, attrs }) {
      const shouldWrapperClose = ref(false);
      const shouldBeVisible = ref(false);

      provide(injectKey, props);

      watch(
         () => props.visible,
         v => {
            if (v) {
               shouldBeVisible.value = true;
               shouldWrapperClose.value = false;
            } else {
               shouldWrapperClose.value = true;
            }
         },
         {
            immediate: true,
         }
      );
      return () => {
         if (!props.visible && !shouldBeVisible.value) return undefined;

         return h(
            SheetContainer,
            {
               onCloseSheet: () => {
                  shouldBeVisible.value = false;
                  emit('update:visible', false);
               },
               shouldWrapperClose: shouldWrapperClose.value,
               shiftAttrs: { ...attrs },
            },
            {
               default: slots.default,
            }
         );
      };
   },
});
