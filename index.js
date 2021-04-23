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
import { defineComponent, h, ref, onMounted, computed, watch, } from 'vue';
var SheetHead = h('div', {
    "class": 'vier-sheet-head'
}, [h('div', { "class": 'vier-head-icon' })]);
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
        function onTouchMouseUp(e) {
            e.preventDefault();
            if (yTotal.value > 175) {
                // console.log(sheetBeginningTop.value);
                // closeSheet();
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
                h(SheetHead, {
                    ref: sheetHead,
                    onMousedown: onTouchMouseDown,
                    onTouchstart: onTouchMouseDown
                }),
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
        visible: {
            type: Boolean,
            required: true
        }
    },
    setup: function (props, _a) {
        var attrs = _a.attrs, slots = _a.slots, emit = _a.emit;
        var shouldClose = ref(false);
        var canClose = ref(false);
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
                style: {
                    '--sheet-container-color': 'rgba(0,0,0,0.5)'
                },
                "class": "" + (shouldClose.value ? 'anim-out' : '')
            }, [
                h(SheetItem, __assign(__assign({}, attrs), { onHide: function () {
                        emit('closeSheet');
                    }, onCloseStart: function () { return (shouldClose.value = true); }, onCanClose: function () { return (canClose.value = true); }, shouldClose: shouldClose.value }), {
                    "default": slots["default"]
                }),
            ]);
        };
    }
});
export var Sheet = defineComponent({
    name: 'VierSheet',
    props: {
        visible: {
            type: Boolean,
            required: true
        }
    },
    emits: {
        'update:Visible': function (value) { return true; }
    },
    setup: function (props, _a) {
        var emit = _a.emit, slots = _a.slots, attrs = _a.attrs;
        return function () {
            if (!props.visible)
                return undefined;
            return h(SheetContainer, __assign({ visible: props.visible, onCloseSheet: function () { return emit('update:Visible', false); } }, attrs), {
                "default": slots["default"]
            });
        };
    }
});
