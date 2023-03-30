# 2.0.4

- Fixed leave animation for devices that does not support single frames.

# 2.0.3

- Fixed touch device interactive element issues. It was because of preventing default behavior of `touchstart` event. Now `touchmove` event is prevented to block scrolling.

<br>

# 2.0.2

- Added `overflow: hidden` style to `bottom-sheet-backdrop` to fix scroll bar issues.

<br>

# 2.0.1

- Added type support for new version.

<br>

# 2.0.0
### Features
  - Added `noStretch` prop, this prop prevents stretching upwards on overswipe.

  - Added `noHeader` prop to remove header element completely.

  - Added `onlyHeaderSwipe` prop, if given swipe will be detected on header only.

### Breaking Changes
  - Style props are removed `minHeight`, `height` and `radius` etc. now Sheet supports css parameters, use them to control sheet's styling. If you want you can direcly access classes and change them.
    ### Supported variables:
    - --bottom-sheet-backdrop-background-color
    - --bottom-sheet-max-width
    - --bottom-sheet-bakground-color
    - --bottom-sheet-min-width
    - --bottom-sheet-max-height
    - --bottom-sheet-border-radius
    - --bottom-sheet-header-bar-background-color
    - --bottom-sheet-header-bar-border-radius
 
  - `clickOutside` prop is changed to `noClickOutside` to support only-key-attribute.

  - `slideIcon` attribute removed due to `header` slot.

  - Now swipe detection includes whole screen, it was only header before.


### Behavior Changes
  - Now stretching upwards resizes the sheet instead of just a fake background.
<br>
