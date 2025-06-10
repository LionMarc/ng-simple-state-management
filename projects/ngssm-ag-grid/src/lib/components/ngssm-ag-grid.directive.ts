import { Directive, inject, signal, input, effect, runInInjectionContext, Injector } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { take } from 'rxjs';

import { AgGridAngular } from 'ag-grid-angular';
import { DefaultMenuItem, GetContextMenuItemsParams, MenuItemDef } from 'ag-grid-community';

import { createSignal, Logger, Store } from 'ngssm-store';

import { AgGridAction, AgGridActionType, RegisterAgGridStateAction, RegisterSelectedRowsAction } from '../actions';
import { ChangeOrigin, selectAgGridState } from '../state';
import { defaultAgGridColumnsEvents, NgssmAgGridConfig } from './ngssm-ag-grid-config';

@Directive({
  selector: '[ngssmAgGrid]'
})
export class NgssmAgGridDirective {
  private readonly logger = inject(Logger);
  private readonly store = inject(Store);
  private readonly agGridAngular = inject(AgGridAngular);
  private readonly injector = inject(Injector);

  private readonly gridInitialized = signal(false);
  private readonly gridStates = createSignal((state) => selectAgGridState(state).gridStates);
  private readonly selectedRows = createSignal((state) => selectAgGridState(state).selectedRows);

  public readonly config = input.required<NgssmAgGridConfig, string | NgssmAgGridConfig>({
    alias: 'ngssmAgGrid',
    transform: (v) => {
      if (typeof v === 'string') {
        return {
          gridId: v as string
        };
      }

      const conf = v as NgssmAgGridConfig;
      return {
        ...conf
      };
    }
  });

  constructor() {
    // Setup gridInintialized signal
    this.agGridAngular.gridReady.pipe(take(1)).subscribe(() => this.gridInitialized.set(true));

    // Apply registered grid setup is any and start listening to ag-grid events
    const effectRef = effect(() => {
      if (!this.gridInitialized()) {
        return;
      }

      this.logger.information(`[NgssmAgGridDirective] Initialization for '${this.config().gridId}' in progress`);

      const gridState = this.gridStates()[this.config().gridId];
      if (gridState) {
        this.agGridAngular.api.applyColumnState({
          state: gridState.columnsState,
          applyOrder: true
        });
        this.agGridAngular.api.setFilterModel(gridState.filterModel);
      }

      if (this.config().keepSelection) {
        const selection = this.selectedRows()[this.config().gridId];
        if (selection) {
          const ids = selection.ids ?? [];
          this.agGridAngular.api.forEachNode((node) => {
            if (node.id) {
              node.setSelected(ids.includes(node.id));
            }
          });
        }
      }

      runInInjectionContext(this.injector, () => this.initSateChangeListener());

      effectRef.destroy();

      this.logger.information(`[NgssmAgGridDirective] Initialization for '${this.config().gridId}' done`);
    });

    // process changes in columns when not comming from ui
    effect(() => {
      if (!this.gridInitialized()) {
        return;
      }

      const gridState = this.gridStates()[this.config().gridId];
      if (gridState?.origin === ChangeOrigin.other) {
        this.agGridAngular.api.applyColumnState({
          state: gridState.columnsState,
          applyOrder: true
        });
        this.agGridAngular.api.setFilterModel(gridState.filterModel);
      }
    });

    // process changes in selection when not comming from ui
    effect(() => {
      if (!this.gridInitialized()) {
        return;
      }

      if (this.config().keepSelection !== true) {
        return;
      }

      const selection = this.selectedRows()[this.config().gridId];
      if (!selection || selection.origin !== ChangeOrigin.other) {
        return;
      }

      const ids = selection.ids ?? [];
      this.agGridAngular.api.forEachNode((node) => {
        if (node.id) {
          node.setSelected(ids.includes(node.id));
        }
      });
    });

    this.agGridAngular.getContextMenuItems = (params) => this.getContextMenuItems(params);
  }

  private initSateChangeListener(): void {
    (this.config().listenedColumnsEvents ?? defaultAgGridColumnsEvents).forEach((eventType) => {
      this.agGridAngular.api.addEventListener(eventType, () => this.saveGridState());
    });

    this.agGridAngular.rowSelected.pipe(takeUntilDestroyed()).subscribe(() => this.processSelectionChanged());
  }

  private saveGridState(): void {
    const state = this.agGridAngular.api.getColumnState();
    const filterModel = this.agGridAngular.api.getFilterModel();
    this.store.dispatchAction(new RegisterAgGridStateAction(this.config().gridId, ChangeOrigin.agGrid, state, filterModel));
  }

  private processSelectionChanged(): void {
    if (this.config().keepSelection !== true) {
      return;
    }

    const selectedRows = this.agGridAngular.api
      .getSelectedNodes()
      .map((n) => n.id ?? '')
      .filter((n) => n !== '');

    this.store.dispatchAction(new RegisterSelectedRowsAction(this.config().gridId, ChangeOrigin.agGrid, selectedRows));
  }

  private getContextMenuItems(params: GetContextMenuItemsParams): (DefaultMenuItem | MenuItemDef)[] {
    this.logger.information('[NgssmAgGridDirective] Generating the context menu...');
    const menuItems: (DefaultMenuItem | MenuItemDef)[] = [];
    const getContextMenuItems = this.config().getContextMenuItems;
    if (getContextMenuItems) {
      menuItems.push(...(getContextMenuItems(params) as (DefaultMenuItem | MenuItemDef)[]));
    } else {
      menuItems.push(...(params.defaultItems ?? []));
    }

    if (this.config().canSaveOnDiskColumnsState === true) {
      const gridId = this.config().gridId;
      menuItems.push(
        ...[
          'separator' as DefaultMenuItem,
          {
            name: 'Save columns state',
            action: () => this.store.dispatchAction(new AgGridAction(AgGridActionType.saveColumnsStateOnDisk, gridId)),
            icon: '<i class="fa-regular fa-floppy-disk"></i>'
          },
          {
            name: 'Restore columns state',
            action: () => this.store.dispatchAction(new AgGridAction(AgGridActionType.resetColumnsStateFromDisk, gridId)),
            icon: '<i class="fa-solid fa-rotate-right"></i>'
          },
          {
            name: 'Reset columns state to default',
            action: () => {
              this.agGridAngular.api.resetColumnState();
              this.agGridAngular.api.setFilterModel(null);
            },
            icon: '<i class="fa-solid fa-clock-rotate-left"></i>'
          }
        ]
      );
    }
    return menuItems;
  }
}
