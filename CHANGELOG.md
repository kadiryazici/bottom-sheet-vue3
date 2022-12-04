# 0.4.0
### Features
  - New `itemDefaults` prop to create default options for all selectable items can be created.

  - New `createItemDefaults(options: ItemDefaults)` function for default options, this function will wrap `wrapperComponentOrTag` with `markRaw` if component is given.

### Bug Fixes
  - Fixed not wrapping functional components with `markRaw` in `item()` and `itemGroup()`.
 
<br>

# 0.3.1
### Bug Fixes
  - Fixed types of hooks/events.
  - `Context['selectFocusedElement']` was incorrect name, fixed to correct one `Context['selectFocusedItem']`
 
<br>

# 0.3.0
### Features

   - Now `focus` event/hook has a fourth parameter `byPointer: boolean`. If user is focused to an item by pointer this parameter will be `true` otherwise `false`.

  - Now `DOMFocus` event has four arguments. Frst argument of `DomFocus` event is `Focus Event`, rest is `Meta, Item<Meta>, HTMLElement`. 

### Breaking Changes
  - Removed `itemHover` event and `Context['onHover']` hook, use focus with fourth parameter instead.
 
<br>

# 0.2.3

### Project Refactors

  - Removed unused variables from setup return.

<br>

# 0.2.2
### Doc Updates

  - Updated readme

<br>

# 0.2.1

### Features
  - Now `ItemOptions` have `disabled` option. Disabled items have `vue-selectable-items-item-disabled` class.
    ```ts
    item({
      key: 'myKey',
      disabled: true
    })
    ```

### Bug Fixes
  - If current focused item key doesn't exist anymore, focus will be resetted.
<br>

# 0.2.0

### Features

  - `itemFocus`, `itemUnfocus`, `itemDOMFocus`, `itemHover` emits are added.

  - `SelectableItems` component now exposes `Context` as template ref.

  - Now all events has 3 arguments; Meta, Item and HTMLElement.

  - New exported functions `filterSelectableAndCustomItems` and `filterSelectableItems`.

  - Now `onSelect` property of an item has correct type support.

- ### Breaking Changes
  - `getItemMetaDataByKey` renamed as `getItemMetaByKey` with generic support. `getItemMetabyKey<Meta = unknown>`

  - `getSelectableItems` now supports generic. `getSelectableItems<Meta = unknown>`

  - `getFocusedElement` renamed as `getFocusedItemElement`

  - `onMouseEnter` renamed as `onHover`

<br>

# 0.1.1
### Doc Updates

- Updated readme.

<br>

# 0.1.0

- `itemGroup()` and `item()` now wraps given `wrapperComponentOrTag` with `markRaw` for performance optimization.
- `itemGroup()` and `item()` now has type support for `wrapperProps`.
- `onClick(meta)` property of `item()` now has correct types.
- Added `data-vue-selectable-items-item` to selectable item elements to help users query items like `document.activeElement.hasAttribute('data-vue-selectable-items-item')`.

### Breaking Changes

- Now each item requires a unique key, old approach was creating a random key for each item but that wasn't a good choice because most people are creating items in a computed and computed creates unique key for each trigger. This makes all items to rerender even if they didn't change.

- itemGroup, customItem and item functions are now expecting 1 argument as object and has generic meta type support.

- `metaData` renamed to `meta` and.

- `slotName` option of `CustomItem` renamed as `name`.

<br>

# 0.0.2

- Added new functions to `setup` prop arguments.
- Exported missing types.
