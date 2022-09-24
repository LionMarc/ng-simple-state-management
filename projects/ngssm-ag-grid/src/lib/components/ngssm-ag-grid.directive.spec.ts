import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BehaviorSubject } from 'rxjs';

import { AgGridAngular, AgGridModule } from 'ag-grid-angular';
import { GridOptions } from 'ag-grid-community';

import { Action, Store } from 'ngssm-store';

import { AgGridStateSpecification, ChangeOrigin, updateAgGridState } from '../state';
import { NgssmAgGridDirective } from './ngssm-ag-grid.directive';

interface Item {
  id: number;
  title: string;
  description: string;
}

@Component({
  template: `
    <ag-grid-angular fxFlex class="ag-theme-material" [gridOptions]="gridOptions" [rowData]="items" [ngssm-ag-grid]="'items'">
    </ag-grid-angular>
  `,
  styles: [
    `
      :host {
        min-height: 400px;
        max-height: 400px;
        display: flex;
        flex-direction: column;
      }
    `
  ]
})
class TestingComponent {
  public readonly gridOptions: GridOptions = {
    defaultColDef: {
      resizable: true,
      sortable: true
    },
    columnDefs: [
      {
        field: 'id',
        headerName: 'Id',
        filter: 'agNumberColumnFilter',
        width: 80
      },
      {
        field: 'title',
        headerName: 'Title',
        filter: 'agTextColumnFilter',
        width: 400
      },
      {
        field: 'description',
        headerName: 'Description',
        filter: 'agTextColumnFilter',
        width: 800
      }
    ]
  };

  public readonly items: Item[] = [
    {
      id: 1,
      title: 'First title',
      description: 'Description for the firs item'
    },
    {
      id: 2,
      title: 'Second title',
      description: 'Description for the second item'
    }
  ];
}

class StoreMock {
  public state$ = new BehaviorSubject<{ [key: string]: any }>({});

  constructor(initialState: { [key: string]: any }) {
    this.state$.next(initialState);
  }

  public dispatchAction(action: Action): void {}

  public dispatchActionType(type: string): void {}
}

describe('NgssmAgGridDirective', () => {
  let fixture: ComponentFixture<TestingComponent>;
  let store: StoreMock;

  beforeEach(async () => {
    store = new StoreMock({ [AgGridStateSpecification.featureStateKey]: AgGridStateSpecification.initialState });

    await TestBed.configureTestingModule({
      imports: [AgGridModule, FlexLayoutModule],
      declarations: [NgssmAgGridDirective, TestingComponent],
      providers: [{ provide: Store, useValue: store }]
    }).compileComponents();

    fixture = TestBed.createComponent(TestingComponent);

    fixture.detectChanges();
  });

  it('should create an instance', () => {
    const directive = fixture.debugElement.queryAll(By.directive(NgssmAgGridDirective))[0].injector.get(NgssmAgGridDirective);
    expect(directive).toBeTruthy();
  });

  [ChangeOrigin.agGrid, ChangeOrigin.other].forEach((origin) => {
    it(`should initialize the grid column state when the state has been updated by '${origin}' `, async () => {
      let state = store.state$.getValue();
      state = updateAgGridState(state, {
        gridStates: {
          items: {
            $set: {
              origin,
              columnsState: [
                {
                  colId: 'description'
                },
                {
                  colId: 'title'
                },
                {
                  colId: 'id'
                }
              ]
            }
          }
        }
      });
      store.state$.next(state);

      fixture.detectChanges();
      await fixture.whenStable();

      const agGrid = fixture.debugElement.query(By.css('ag-grid-angular')).injector.get(AgGridAngular);
      expect(agGrid).toBeTruthy();
      const orderedColumns = agGrid.columnApi.getColumnState().map((c) => c.colId);
      expect(orderedColumns).toEqual(['description', 'title', 'id']);
    });
  });

  describe('when state has been already initialized', () => {
    beforeEach(async () => {
      let state = store.state$.getValue();
      state = updateAgGridState(state, {
        gridStates: {
          items: {
            $set: {
              origin: ChangeOrigin.other,
              columnsState: [
                {
                  colId: 'description'
                },
                {
                  colId: 'title'
                },
                {
                  colId: 'id'
                }
              ]
            }
          }
        }
      });
      store.state$.next(state);

      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();
    });

    it('should update the grid when the state update has other as origin', async () => {
      let state = store.state$.getValue();
      state = updateAgGridState(state, {
        gridStates: {
          items: {
            $set: {
              origin: ChangeOrigin.other,
              columnsState: [
                {
                  colId: 'description'
                },
                {
                  colId: 'id'
                },
                {
                  colId: 'title'
                }
              ]
            }
          }
        }
      });
      store.state$.next(state);

      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();

      const agGrid = fixture.debugElement.query(By.css('ag-grid-angular')).injector.get(AgGridAngular);
      expect(agGrid).toBeTruthy();
      const orderedColumns = agGrid.columnApi.getColumnState().map((c) => c.colId);
      expect(orderedColumns).toEqual(['description', 'id', 'title']);
    });

    it('should not update the grid when the state update has agGrid as origin', async () => {
      let state = store.state$.getValue();
      state = updateAgGridState(state, {
        gridStates: {
          items: {
            $set: {
              origin: ChangeOrigin.agGrid,
              columnsState: [
                {
                  colId: 'description'
                },
                {
                  colId: 'id'
                },
                {
                  colId: 'title'
                }
              ]
            }
          }
        }
      });
      store.state$.next(state);

      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();

      const agGrid = fixture.debugElement.query(By.css('ag-grid-angular')).injector.get(AgGridAngular);
      expect(agGrid).toBeTruthy();
      const orderedColumns = agGrid.columnApi.getColumnState().map((c) => c.colId);
      expect(orderedColumns).toEqual(['description', 'title', 'id']);
    });
  });
});
