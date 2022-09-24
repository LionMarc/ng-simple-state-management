import { Directive, Input, OnDestroy } from '@angular/core';
import { combineLatest, map, ReplaySubject, Subject, take, takeUntil } from 'rxjs';

import { AgGridAngular } from 'ag-grid-angular';

import { Store } from 'ngssm-store';

import { RegisterAgGridStateAction } from '../actions';
import { ChangeOrigin, selectAgGridState } from '../state';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[ngssm-ag-grid]'
})
export class NgssmAgGridDirective implements OnDestroy {
  private readonly unsubsribeAll$ = new Subject<void>();
  private readonly _gridId$ = new ReplaySubject<string>();

  constructor(private store: Store, private agGridAngular: AgGridAngular) {
    this.agGridAngular.gridReady.pipe(take(1)).subscribe((v) => {
      combineLatest([
        this.store.state$.pipe(
          take(1),
          map((s) => selectAgGridState(s))
        ),
        this._gridId$
      ])
        .pipe(take(1))
        .subscribe((values) => {
          if (values[0].gridStates[values[1]]) {
            this.agGridAngular.columnApi.applyColumnState({
              state: values[0].gridStates[values[1]].columnsState,
              applyOrder: true
            });
          }

          this.initSateChangeListener();
        });
    });

    combineLatest([this.store.state$.pipe(map((s) => selectAgGridState(s))), this._gridId$])
      .pipe(takeUntil(this.unsubsribeAll$))
      .subscribe((values) => {
        if (values[0].gridStates[values[1]]?.origin === ChangeOrigin.other) {
          this.agGridAngular.columnApi.applyColumnState({
            state: values[0].gridStates[values[1]].columnsState,
            applyOrder: true
          });
        }
      });
  }

  @Input('ngssm-ag-grid') public set gridId(value: string) {
    this._gridId$.next(value);
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
  }

  private saveGridState(): void {
    const state = this.agGridAngular.columnApi.getColumnState();
    this._gridId$
      .pipe(take(1))
      .subscribe((gridId) => this.store.dispatchAction(new RegisterAgGridStateAction(gridId, ChangeOrigin.agGrid, state)));
  }
}
