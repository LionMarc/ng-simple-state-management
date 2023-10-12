import { Directive, Input, OnDestroy } from '@angular/core';
import { BehaviorSubject, combineLatest, map, Subject, take, takeUntil } from 'rxjs';

import { AgGridAngular } from 'ag-grid-angular';
import { GetContextMenuItemsParams, MenuItemDef } from 'ag-grid-community';

import { Store } from 'ngssm-store';

import { AgGridAction, AgGridActionType, RegisterAgGridStateAction, RegisterSelectedRowsAction } from '../actions';
import { ChangeOrigin, selectAgGridState } from '../state';
import { NgssmAgGridConfig } from './ngssm-ag-grid-config';

@Directive({
  selector: '[ngssmAgGrid]',
  standalone: true
})
export class NgssmAgGridDirective implements OnDestroy {
  private readonly unsubsribeAll$ = new Subject<void>();
  private readonly _config$ = new BehaviorSubject<NgssmAgGridConfig>({
    gridId: ''
  });

  constructor(
    private store: Store,
    private agGridAngular: AgGridAngular
  ) {
    this.agGridAngular.gridReady.pipe(take(1)).subscribe((v) => {
      combineLatest([
        this.store.state$.pipe(
          take(1),
          map((s) => selectAgGridState(s))
        ),
        this._config$
      ])
        .pipe(take(1))
        .subscribe((values) => {
          if (values[0].gridStates[values[1].gridId]) {
            this.agGridAngular.columnApi.applyColumnState({
              state: values[0].gridStates[values[1].gridId].columnsState,
              applyOrder: true
            });
          }

          if (values[0].selectedRows[values[1].gridId]) {
            if (values[1].keepSelection === true) {
              const ids = values[0].selectedRows[values[1].gridId]?.ids ?? [];
              this.agGridAngular.api.forEachNode((node) => {
                if (node.id) {
                  node.setSelected(ids.includes(node.id));
                }
              });
            }
          }

          this.initSateChangeListener();
        });
    });

    combineLatest([this.store.state$.pipe(map((s) => selectAgGridState(s).gridStates)), this._config$])
      .pipe(takeUntil(this.unsubsribeAll$))
      .subscribe((values) => {
        if (values[0][values[1].gridId]?.origin === ChangeOrigin.other) {
          this.agGridAngular.columnApi.applyColumnState({
            state: values[0][values[1].gridId].columnsState,
            applyOrder: true
          });
        }
      });

    combineLatest([this.store.state$.pipe(map((s) => selectAgGridState(s).selectedRows)), this._config$])
      .pipe(takeUntil(this.unsubsribeAll$))
      .subscribe((values) => {
        if (values[0][values[1].gridId]?.origin === ChangeOrigin.other && values[1].keepSelection === true) {
          const ids = values[0][values[1].gridId]?.ids ?? [];
          this.agGridAngular.api.forEachNode((node) => {
            if (node.id) {
              node.setSelected(ids.includes(node.id));
            }
          });
        }
      });

    this.agGridAngular.getContextMenuItems = (params) => this.getContextMenuItems(params);
  }

  @Input('ngssmAgGrid') public set config(value: string | NgssmAgGridConfig) {
    if (typeof value === 'string') {
      this._config$.next({
        gridId: value as string
      });
    } else {
      this._config$.next(value as NgssmAgGridConfig);
    }
  }

  public ngOnDestroy(): void {
    this.unsubsribeAll$.next();
    this.unsubsribeAll$.complete();
  }

  private initSateChangeListener(): void {
    this.agGridAngular.sortChanged.pipe(takeUntil(this.unsubsribeAll$)).subscribe(() => this.saveGridState());
    this.agGridAngular.filterChanged.pipe(takeUntil(this.unsubsribeAll$)).subscribe(() => this.saveGridState());
    this.agGridAngular.columnPinned.pipe(takeUntil(this.unsubsribeAll$)).subscribe(() => this.saveGridState());
    this.agGridAngular.columnResized.pipe(takeUntil(this.unsubsribeAll$)).subscribe(() => this.saveGridState());
    this.agGridAngular.displayedColumnsChanged.pipe(takeUntil(this.unsubsribeAll$)).subscribe(() => this.saveGridState());
    this.agGridAngular.rowSelected.pipe(takeUntil(this.unsubsribeAll$)).subscribe(() => this.processSelectionChanged());
  }

  private saveGridState(): void {
    const state = this.agGridAngular.columnApi.getColumnState();
    this._config$
      .pipe(take(1))
      .subscribe((gridId) => this.store.dispatchAction(new RegisterAgGridStateAction(gridId.gridId, ChangeOrigin.agGrid, state)));
  }

  private processSelectionChanged(): void {
    const selectedRows = this.agGridAngular.api
      .getSelectedNodes()
      .map((n) => n.id ?? '')
      .filter((n) => n !== '');
    this._config$.pipe(take(1)).subscribe((config) => {
      if (config.keepSelection === true) {
        this.store.dispatchAction(new RegisterSelectedRowsAction(config.gridId, ChangeOrigin.agGrid, selectedRows));
      }
    });
  }

  private getContextMenuItems(params: GetContextMenuItemsParams): (string | MenuItemDef)[] {
    const menuItems: (string | MenuItemDef)[] = [...(params.defaultItems ?? [])];
    if (this._config$.getValue().canSaveOnDiskColumnsState === true) {
      menuItems.push(
        ...[
          'separator',
          {
            name: 'Save columns state',
            action: () =>
              this._config$
                .pipe(take(1))
                .subscribe((config) => this.store.dispatchAction(new AgGridAction(AgGridActionType.saveColumnsStateOnDisk, config.gridId))),
            icon: '<i class="fa-regular fa-floppy-disk"></i>'
          },
          {
            name: 'Restore columns state',
            action: () =>
              this._config$
                .pipe(take(1))
                .subscribe((config) =>
                  this.store.dispatchAction(new AgGridAction(AgGridActionType.resetColumnsStateFromDisk, config.gridId))
                ),
            icon: '<i class="fa-solid fa-rotate-right"></i>'
          },
          {
            name: 'Reset columns state to default',
            action: () => this.agGridAngular.columnApi.resetColumnState(),
            icon: '<i class="fa-solid fa-clock-rotate-left"></i>'
          }
        ]
      );
    }
    return menuItems;
  }
}
