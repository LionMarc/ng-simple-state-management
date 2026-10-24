# ngssm-ag-grid

`ngssm-ag-grid` connects [AG Grid](https://www.ag-grid.com/) to the NgSsm store. It keeps grid column configuration and (optionally) row selection in application state, and provides helpers and components for common AG Grid integrations.

## Features

- Tracks column order and visibility, sorting, pinning, resizing, column groups, and filter models in the NgSsm store.
- Restores stored column and filter state when a grid is initialized, and applies later state changes made outside the grid UI.
- Optionally keeps selected row IDs in the store and restores the selection when the grid is initialized.
- Exposes selected row IDs as a reactive signal for a grid.
- Can save and restore column state using browser `localStorage`. Startup loading and the grid context-menu commands can be enabled through configuration.
- Includes a theme directive, action cell renderer, confirmation popup, base cell editor, and column-definition helpers.

## Setup

Register the NgSsm store and the ag-grid providers in your application configuration:

```ts
import { provideNgssmAgGrid } from 'ngssm-ag-grid';
import { provideNgssmStore } from 'ngssm-store';

export const appConfig = {
  providers: [
    provideNgssmStore(),
    provideNgssmAgGrid({
      loadSavedGridStatesAtStartup: true
    })
  ]
};
```

Set `loadSavedGridStatesAtStartup` to `true` to load grids with saved column state from `localStorage` during application startup. It is optional and defaults to disabled.

## Use the grid directive

Import `AgGridAngular` and the NgSsm directives into the component that declares the grid:

```ts
import { Component } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { NgssmAgGridDirective, NgssmAgGridThemeDirective } from 'ngssm-ag-grid';

@Component({
  imports: [AgGridAngular, NgssmAgGridDirective, NgssmAgGridThemeDirective],
  template: `
    <ag-grid-angular
      ngssmAgGridTheme
      [ngssmAgGrid]="{ gridId: 'orders', keepSelection: true }"
      [rowData]="orders"
      [columnDefs]="columnDefs"
      [getRowId]="getRowId" />
  `
})
export class OrdersComponent {
  // Define orders, columnDefs, and getRowId for your grid.
}
```

Each grid needs a unique `gridId`. When `keepSelection` is enabled, provide AG Grid with a stable `getRowId` callback so selections can be restored reliably.

## Read selected row IDs

Use `selectedRowsIdsSignal` inside an Angular injection context, such as a component field initializer, to get a reactive signal of selected row IDs. It accepts either a grid ID string or a `Signal<string>`:

```ts
import { signal } from '@angular/core';
import { selectedRowsIdsSignal } from 'ngssm-ag-grid';

export class OrdersComponent {
  public readonly selectedOrderIds = selectedRowsIdsSignal('orders');

  public readonly activeGridId = signal('orders');
  public readonly activeGridSelectedIds = selectedRowsIdsSignal(this.activeGridId);
}
```

The returned signal updates when the selection in the store changes or, when given a grid ID signal, when that ID changes. It returns an empty array when the grid has no selected rows.

`NgssmAgGridConfig` also supports:

- `listenedColumnsEvents`: override the AG Grid events that trigger column state updates. By default, sort, filter, pin, resize, displayed-column, and column-group changes are listened to.
- `canSaveOnDiskColumnStates`: add save, restore, and reset commands to the grid context menu. This feature requires the AG Grid Enterprise context menu.
- `getContextMenuItems`: provide custom context-menu items.

The provider accepts `theme`, `defaultColDef`, and `statusBar` options as well. The `ngssmAgGridTheme` directive applies the configured theme class and supplies the optional defaults when they are not already set on the grid.

## Actions

The library provides actions for updating grid state and controlling persistence. The state-setting actions are registered by `provideNgssmAgGrid` and update the store when dispatched:

```ts
import { ChangeOrigin, NgssmClearSelectedRowsAction, NgssmSetAgGridStateAction, NgssmSetSelectedRowsAction } from 'ngssm-ag-grid';

store.dispatchAction(new NgssmSetAgGridStateAction(gridId, ChangeOrigin.other, columnStates, columnGroupStates, filterModel));
store.dispatchAction(new NgssmSetSelectedRowsAction(gridId, ChangeOrigin.other, selectedRowIds));
store.dispatchAction(new NgssmClearSelectedRowsAction(gridId));
```

`NgssmSetAgGridStateAction` sets a grid's column states, column group states, and filter model. `NgssmSetSelectedRowsAction` sets the selected row IDs. `NgssmClearSelectedRowsAction` clears the selected IDs and deselects rows in the grid. Use `ChangeOrigin.other` for changes made outside AG Grid so the directive applies them to the grid; the directive itself dispatches changes with `ChangeOrigin.agGrid`.

To save or restore a grid's column state in `localStorage`, dispatch `NgssmAgGridAction` with the corresponding action type:

```ts
import { NgssmAgGridAction, NgssmAgGridActionType } from 'ngssm-ag-grid';

store.dispatchAction(new NgssmAgGridAction(NgssmAgGridActionType.saveColumnStatesOnDisk, gridId));
store.dispatchAction(new NgssmAgGridAction(NgssmAgGridActionType.restoreColumnStatesFromDisk, gridId));
```

The action types are `setAgGridState`, `setSelectedRows`, `clearSelectedRows`, `saveColumnStatesOnDisk`, and `restoreColumnStatesFromDisk` on `NgssmAgGridActionType`. The directive can dispatch state and selection actions automatically; disk actions are also used by the optional context-menu commands.

## Exports

The package exports the grid directives and configuration, NgSsm grid state and actions, plus `getColDefWithNoPadding` and `getColDefForEditableColumn` helpers. It also exports the action cell renderer, confirmation popup, and base cell editor components.
