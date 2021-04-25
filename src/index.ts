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
   provide,
   InjectionKey,
   inject,
   watchEffect,
   Teleport
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
   clickOutside: boolean;
}

const options = {
   minHeight: {
      default: '250px',
      type: String as PropType<string>
   },
   maxWidth: {
      default: '500px',
      type: String as PropType<string>
   },
   maxHeight: {
      default: '90%',
      type: String as PropType<string>
   },
   height: {
      default: 'auto',
      type: String as PropType<string>
   },
   slideIcon: {
      default: defaultSlideIcon,
      type: null
   },
   containerColor: {
      default: 'rgba(0,0,0,.5)',
      type: String as PropType<string>
   },
   sheetColor: {
      default: '#fff',
      type: String as PropType<string>
   },
   sliderIconColor: {
      default: 'rgba(0, 0, 0, 0.416)',
      type: String as PropType<string>
   },
   radius: {
      default: '25px',
      type: String as PropType<string>
   },
   threshold: {
      type: Number as PropType<number>,
      default: 50
   },
   clickOutside: {
      type: Boolean as PropType<boolean>,
      default: true
   }
};

const SheetItem = defineComponent({
   name: 'VierSheetItem',
   emits: {
      destroy: null,
      closeStart: null,
      canClose: null
   },
   props: {
      shouldClose: {
         type: Boolean as PropType<boolean>,
         default: false
      }
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

      const shrink = ref(1);

      watch(transformY, v => {
         if (v < 0) {
            shrink.value = 0;
         } else {
            shrink.value = 1;
         }
      });

      const style = computed(() => ({
         transform: `translateY(${transformY.value}px)`,
         transition: transition.value,
         // '--sheet-body-shrink': shrink.value,
         '--sheet-flexing-top': Math.min(0, transformY.value) + 'px'
      }));

      function onTouchMouseDown(e: MouseEvent | TouchEvent) {
         e.preventDefault();
         transition.value = 'none';
         if (e instanceof window.MouseEvent || e instanceof MouseEvent) {
            yStart.value = e.clientY;
         } else {
            yStart.value = e.touches[0].clientY;
         }
         window.addEventListener('mousemove', onTouchMouseMove, {
            passive: false
         });
         window.addEventListener('touchmove', onTouchMouseMove, {
            passive: false
         });
         window.addEventListener('mouseup', onTouchMouseUp);
         window.addEventListener('touchend', onTouchMouseUp);
      }

      function onTouchMouseMove(e: MouseEvent | TouchEvent) {
         e.preventDefault();
         if (e instanceof window.MouseEvent || e instanceof MouseEvent) {
            yTotal.value = /*Math.max(0,*/ e.clientY - yStart.value; /*);*/
            transformY.value = yTotal.value;
         } else {
            yTotal.value = /*Math.max(0,*/ e.touches[0].clientY - yStart.value; /*);*/
            transformY.value = yTotal.value;
         }
      }

      function closeSheet() {
         const windowBottom = window.innerHeight;
         const targetPixel = sheetBeginningTop.value + (windowBottom - sheetBeginningTop.value + 25);
         transformY.value = targetPixel;
         transition.value = transitionValue;

         if (sheet.value) {
            sheet.value.addEventListener('transitionend', () => {
               // when close animation is over it is time to destroy component
               emit('destroy');
            });
         }
      }

      // watch shouldClose value. If it is true this means Sheet should start close animation.
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
               style: style.value
            },
            [
               h(
                  'div',
                  {
                     class: 'vier-sheet-head',
                     ref: sheetHead,
                     onMousedown: onTouchMouseDown,
                     onTouchstart: onTouchMouseDown
                  },
                  [_props.slideIcon]
               ),
               h(
                  'div',
                  {
                     class: 'vier-sheet-body'
                  },
                  !slots.default
                     ? undefined
                     : slots.default({
                          closeSelf: () => emit('closeStart')
                       })
               )
            ]
         );
   }
});

const SheetContainer = defineComponent({
   name: 'VierSheetContainer',
   inheritAttrs: false,
   emits: {
      closeSheet: () => true
   },
   props: {
      shiftAttrs: {
         type: Object as PropType<Object>
      },
      shouldWrapperClose: {
         type: Boolean as PropType<boolean>
      }
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
         '--sheet-slider-icon-color': _props.sliderIconColor
      }));

      function pointerUp(e: Event, touch: 'touch' | 'mouse') {
         mouseup.value = e.currentTarget as HTMLElement;
         if (canClose.value && _props.clickOutside && mousedown.value === mouseup.value) {
            shouldClose.value = true;
         }
      }

      function pointerDown(e: Event, touch: 'touch' | 'mouse') {
         if (e.target) {
            mousedown.value = e.target as HTMLElement;
         }
      }

      const mousedown = ref<HTMLElement | null>(null);
      const mouseup = ref<HTMLElement | null>(null);
      return () => {
         return h(
            'i',
            {
               id: 'vier-sheet-container',
               onMouseup: (e: Event) => pointerUp(e, 'mouse'),
               onMousedown: (e: Event) => pointerDown(e, 'mouse'),
               onTouchstart: (e: Event) => pointerDown(e, 'touch'),
               onTouchend: (e: Event) => pointerUp(e, 'touch'),
               style: style.value,
               class: `${shouldClose.value ? 'vier-anim-out' : ''}`
            },
            [
               h(
                  SheetItem,
                  {
                     ...props.shiftAttrs,

                     shouldClose: shouldClose.value,
                     onDestroy: () => {
                        emit('closeSheet');
                     },
                     onCloseStart: () => {
                        if (canClose.value) {
                           shouldClose.value = true;
                        }
                     },
                     onCanClose: () => (canClose.value = true)
                  },
                  { default: slots.default }
               )
            ]
         );
      };
   }
});

export const Sheet = defineComponent({
   name: 'VierSheet',
   props: {
      visible: {
         type: Boolean as PropType<boolean>,
         required: true
      },
      ...options
   },
   emits: {
      'update:visible': (value: boolean) => true
   },
   setup(props, { emit, slots, attrs }) {
      const shouldWrapperClose = ref(false);
      const shouldBeVisible = ref(false);

      provide(injectKey, props);

      watchEffect(() => {
         if (props.visible) {
            shouldBeVisible.value = true;
            shouldWrapperClose.value = false;
         } else {
            shouldWrapperClose.value = true;
         }
      });
      return () => {
         if (!props.visible && !shouldBeVisible.value) return undefined;

         return h(
            Teleport,
            {
               to: 'body'
            },
            [
               h(
                  SheetContainer,
                  {
                     onCloseSheet: () => {
                        shouldBeVisible.value = false;
                        emit('update:visible', false);
                     },
                     shouldWrapperClose: shouldWrapperClose.value,
                     shiftAttrs: { ...attrs }
                  },
                  {
                     default: slots.default
                  }
               )
            ]
         );
      };
   }
});
