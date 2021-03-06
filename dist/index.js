'use strict';
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { defineComponent, h, ref, onMounted, computed, watch, createVNode, provide, inject, watchEffect, Teleport } from 'vue';
var defaultSlideIcon = createVNode('div', { "class": 'vier-head-icon' });
var injectKey = Symbol();
var options = {
    minHeight: {
        "default": '250px',
        type: String
    },
    maxWidth: {
        "default": '500px',
        type: String
    },
    maxHeight: {
        "default": '90%',
        type: String
    },
    height: {
        "default": 'auto',
        type: String
    },
    slideIcon: {
        "default": defaultSlideIcon,
        type: null
    },
    containerColor: {
        "default": 'rgba(0,0,0,.5)',
        type: String
    },
    sheetColor: {
        "default": '#fff',
        type: String
    },
    sliderIconColor: {
        "default": 'rgba(0, 0, 0, 0.416)',
        type: String
    },
    radius: {
        "default": '25px',
        type: String
    },
    threshold: {
        type: Number,
        "default": 50
    },
    clickOutside: {
        type: Boolean,
        "default": true
    }
};
var SheetItem = defineComponent({
    name: 'VierSheetItem',
    emits: {
        destroy: null,
        closeStart: null,
        canClose: null
    },
    props: {
        shouldClose: {
            type: Boolean,
            "default": false
        }
    },
    setup: function (props, _a) {
        var slots = _a.slots, emit = _a.emit;
        var sheet = ref(null);
        var sheetHead = ref(null);
        var yStart = ref(0);
        var yTotal = ref(0);
        var sheetBeginningTop = ref(0);
        onMounted(function () {
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
        var transformY = ref(0);
        var transitionValue = 'transform .35s';
        var transition = ref('none');
        var shrink = ref(1);
        watch(transformY, function (v) {
            if (v < 0) {
                shrink.value = 0;
            }
            else {
                shrink.value = 1;
            }
        });
        var style = computed(function () { return ({
            transform: "translateY(" + transformY.value + "px)",
            transition: transition.value,
            // '--sheet-body-shrink': shrink.value,
            '--sheet-flexing-top': Math.min(0, transformY.value) + 'px'
        }); });
        function onTouchMouseDown(e) {
            e.preventDefault();
            transition.value = 'none';
            if (e instanceof window.MouseEvent || e instanceof MouseEvent) {
                yStart.value = e.clientY;
            }
            else {
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
        function onTouchMouseMove(e) {
            e.preventDefault();
            if (e instanceof window.MouseEvent || e instanceof MouseEvent) {
                yTotal.value = /*Math.max(0,*/ e.clientY - yStart.value; /*);*/
                transformY.value = yTotal.value;
            }
            else {
                yTotal.value = /*Math.max(0,*/ e.touches[0].clientY - yStart.value; /*);*/
                transformY.value = yTotal.value;
            }
        }
        function closeSheet() {
            var windowBottom = window.innerHeight;
            var targetPixel = sheetBeginningTop.value + (windowBottom - sheetBeginningTop.value + 25);
            transformY.value = targetPixel;
            transition.value = transitionValue;
            if (sheet.value) {
                sheet.value.addEventListener('transitionend', function () {
                    // when close animation is over it is time to destroy component
                    emit('destroy');
                });
            }
        }
        // watch shouldClose value. If it is true this means Sheet should start close animation.
        watch(function () { return props.shouldClose; }, function (newValue) {
            if (newValue) {
                closeSheet();
            }
        });
        var _props = inject(injectKey);
        function onTouchMouseUp(e) {
            e.preventDefault();
            if (yTotal.value >= _props.threshold) {
                emit('closeStart');
            }
            else {
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
        return function () {
            return h('div', {
                "class": 'vier-sheet',
                ref: sheet,
                style: style.value
            }, [
                h('div', {
                    "class": 'vier-sheet-head',
                    ref: sheetHead,
                    onMousedown: onTouchMouseDown,
                    onTouchstart: onTouchMouseDown
                }, [_props.slideIcon]),
                h('div', {
                    "class": 'vier-sheet-body'
                }, !slots["default"]
                    ? undefined
                    : slots["default"]({
                        closeSelf: function () { return emit('closeStart'); }
                    }))
            ]);
        };
    }
});
var SheetContainer = defineComponent({
    name: 'VierSheetContainer',
    inheritAttrs: false,
    emits: {
        closeSheet: function () { return true; }
    },
    props: {
        shiftAttrs: {
            type: Object
        },
        shouldWrapperClose: {
            type: Boolean
        }
    },
    setup: function (props, _a) {
        var attrs = _a.attrs, slots = _a.slots, emit = _a.emit;
        var shouldClose = ref(false);
        var canClose = ref(false);
        watch(function () { return props.shouldWrapperClose; }, function (v) {
            if (v) {
                shouldClose.value = true;
            }
        });
        var _props = inject(injectKey);
        var style = computed(function () { return ({
            '--container-color': _props.containerColor,
            '--sheet-color': _props.sheetColor,
            '--sheet-height': _props.height,
            '--sheet-max-height': _props.maxHeight,
            '--sheet-max-width': _props.maxWidth,
            '--sheet-min-height': _props.minHeight,
            '--sheet-radius': _props.radius,
            '--sheet-slider-icon-color': _props.sliderIconColor
        }); });
        function pointerUp(e, touch) {
            mouseup.value = e.currentTarget;
            if (canClose.value && _props.clickOutside && mousedown.value === mouseup.value) {
                shouldClose.value = true;
            }
        }
        function pointerDown(e, touch) {
            if (e.target) {
                mousedown.value = e.target;
            }
        }
        var mousedown = ref(null);
        var mouseup = ref(null);
        return function () {
            return h('i', {
                onMouseup: function (e) { return pointerUp(e, 'mouse'); },
                onMousedown: function (e) { return pointerDown(e, 'mouse'); },
                onTouchstart: function (e) { return pointerDown(e, 'touch'); },
                onTouchend: function (e) { return pointerUp(e, 'touch'); },
                style: style.value,
                "class": ["" + (shouldClose.value ? 'vier-anim-out' : ''), 'vier-sheet-container']
            }, [
                h(SheetItem, __assign(__assign({}, props.shiftAttrs), { shouldClose: shouldClose.value, onDestroy: function () {
                        emit('closeSheet');
                    }, onCloseStart: function () {
                        if (canClose.value) {
                            shouldClose.value = true;
                        }
                    }, onCanClose: function () { return (canClose.value = true); } }), { "default": slots["default"] })
            ]);
        };
    }
});
export var Sheet = defineComponent({
    name: 'VierSheet',
    props: __assign({ visible: {
            type: Boolean,
            required: true
        } }, options),
    emits: {
        'update:visible': function (value) { return true; }
    },
    setup: function (props, _a) {
        var emit = _a.emit, slots = _a.slots, attrs = _a.attrs;
        var shouldWrapperClose = ref(false);
        var shouldBeVisible = ref(false);
        provide(injectKey, props);
        watchEffect(function () {
            if (props.visible) {
                shouldBeVisible.value = true;
                shouldWrapperClose.value = false;
            }
            else {
                shouldWrapperClose.value = true;
            }
        });
        return function () {
            if (!props.visible && !shouldBeVisible.value)
                return undefined;
            return h(Teleport, {
                to: 'body'
            }, [
                h(SheetContainer, {
                    onCloseSheet: function () {
                        shouldBeVisible.value = false;
                        emit('update:visible', false);
                    },
                    shouldWrapperClose: shouldWrapperClose.value,
                    shiftAttrs: __assign({}, attrs)
                }, {
                    "default": slots["default"]
                })
            ]);
        };
    }
});
