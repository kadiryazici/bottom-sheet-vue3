import {
   defineComponent,
   h,
   PropType,
   ref,
   onMounted,
   computed,
   watch,
} from 'vue';

const SheetHead = h(
   'div',
   {
      class: 'vier-sheet-head',
   },
   [h('div', { class: 'vier-head-icon' })]
);

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

      function onTouchMouseUp(e: MouseEvent | TouchEvent) {
         e.preventDefault();

         if (yTotal.value > 175) {
            // console.log(sheetBeginningTop.value);
            // closeSheet();
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
               h(SheetHead, {
                  ref: sheetHead,
                  onMousedown: onTouchMouseDown,
                  onTouchstart: onTouchMouseDown,
               }),
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
      visible: {
         type: Boolean as PropType<boolean>,
         required: true,
      },
   },

   setup(props, { attrs, slots, emit }) {
      const shouldClose = ref(false);
      const canClose = ref(false);
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
               style: {
                  '--sheet-container-color': 'rgba(0,0,0,0.5)',
               },
               class: `${shouldClose.value ? 'anim-out' : ''}`,
            },
            [
               h(
                  SheetItem,
                  {
                     ...attrs,
                     onHide: () => {
                        emit('closeSheet');
                     },
                     onCloseStart: () => (shouldClose.value = true),
                     onCanClose: () => (canClose.value = true),
                     shouldClose: shouldClose.value,
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
   },
   emits: {
      'update:Visible': (value: boolean) => true,
   },
   setup(props, { emit, slots, attrs }) {
      return () => {
         if (!props.visible) return undefined;

         return h(
            SheetContainer,
            {
               visible: props.visible,
               onCloseSheet: () => emit('update:Visible', false),
               ...attrs,
            },
            {
               default: slots.default,
            }
         );
      };
   },
});
