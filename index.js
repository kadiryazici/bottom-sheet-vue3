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
import { defineComponent, h, ref, onMounted, computed, watch, createVNode, provide, inject, } from 'vue';
var defaultSlideIcon = createVNode('div', { "class": 'vier-head-icon' });
var injectKey = Symbol();
var options = {
    minHeight: {
        "default": 'auto',
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
        "default": 25
    }
};
var SheetItem = defineComponent({
    name: 'VierSheetItem',
    emits: {
        hide: null,
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
        var style = computed(function () { return ({
            transform: "translateY(" + transformY.value + "px)",
            transition: transition.value
        }); });
        function onTouchMouseDown(e) {
            e.preventDefault();
            transition.value = 'none';
            var iOfTouch = e instanceof TouchEvent;
            var iOfWTouch = e instanceof window.TouchEvent;
            if (e instanceof window.MouseEvent || e instanceof MouseEvent) {
                yStart.value = e.clientY;
            }
            else if (iOfTouch || iOfWTouch) {
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
            var iOfTouch = e instanceof TouchEvent;
            var iOfWTouch = e instanceof window.TouchEvent;
            if (e instanceof window.MouseEvent || e instanceof MouseEvent) {
                yTotal.value = Math.max(0, e.clientY - yStart.value);
                transformY.value = yTotal.value;
            }
            else if (iOfWTouch || iOfTouch) {
                yTotal.value = Math.max(0, e.touches[0].clientY - yStart.value);
                transformY.value = yTotal.value;
            }
        }
        function closeSheet() {
            var windowBottom = window.innerHeight;
            var targetPixel = sheetBeginningTop.value +
                (windowBottom - sheetBeginningTop.value + 25);
            transformY.value = targetPixel;
            transition.value = transitionValue;
            if (sheet.value) {
                sheet.value.addEventListener('transitionend', function () {
                    emit('hide');
                });
            }
        }
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
                h('div', { "class": 'vier-sheet-body' }, {
                    "default": slots["default"]
                }),
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
        return function () {
            return h('div', {
                id: 'vier-sheet-container',
                onClick: function (event) {
                    if (canClose.value) {
                        if (event.target !== event.currentTarget)
                            return;
                        shouldClose.value = true;
                    }
                },
                style: style.value,
                "class": "" + (shouldClose.value ? 'anim-out' : '')
            }, [
                h(SheetItem, __assign(__assign({}, props.shiftAttrs), { containerColor: _props.containerColor, height: _props.height, maxHeight: _props.maxHeight, maxWidth: _props.maxWidth, minHeight: _props.minHeight, radius: _props.radius, sheetColor: _props.sheetColor, sliderIconColor: _props.sliderIconColor, slideIcon: _props.slideIcon, threshold: _props.threshold, shouldClose: shouldClose.value, onHide: function () {
                        emit('closeSheet');
                    }, onCloseStart: function () {
                        if (canClose.value) {
                            shouldClose.value = true;
                        }
                    }, onCanClose: function () { return (canClose.value = true); } }), {
                    "default": slots["default"]
                }),
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
        watch(function () { return props.visible; }, function (v) {
            if (v) {
                shouldBeVisible.value = true;
                shouldWrapperClose.value = false;
            }
            else {
                shouldWrapperClose.value = true;
            }
        }, {
            immediate: true
        });
        return function () {
            if (!props.visible && !shouldBeVisible.value)
                return undefined;
            return h(SheetContainer, {
                onCloseSheet: function () {
                    shouldBeVisible.value = false;
                    emit('update:visible', false);
                },
                shouldWrapperClose: shouldWrapperClose.value,
                shiftAttrs: __assign({}, attrs)
            }, {
                "default": slots["default"]
            });
        };
    }
});
