import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { AgGridAngular, AgGridModule } from 'ag-grid-angular';
import { GetRowIdParams, GridOptions } from 'ag-grid-community';

import { Store } from 'ngssm-store';
import { StoreMock } from 'ngssm-store/testing';

import { AgGridStateSpecification, ChangeOrigin, updateAgGridState } from '../state';
import { NgssmAgGridDirective } from './ngssm-ag-grid.directive';
import { NgssmAgGridConfig } from './ngssm-ag-grid-config';

interface Item {
  id: number;
  title: string;
  description: string;
}

@Component({
  template: `
    <ag-grid-angular class="ag-theme-material" [gridOptions]="gridOptions" [rowData]="items" [ngssmAgGrid]="'items'"> </ag-grid-angular>
  `,
  styles: [
    `
      :host {
        min-height: 400px;
        max-height: 400px;
        display: flex;
        flex-direction: column;
      }

      ag-grid-angular {
        height: 100%;
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

@Component({
  template: `
    <ag-grid-angular class="ag-theme-material" [gridOptions]="gridOptions" [rowData]="items" [ngssmAgGrid]="config"> </ag-grid-angular>
  `,
  styles: [
    `
      :host {
        min-height: 400px;
        max-height: 400px;
        display: flex;
        flex-direction: column;
        align-items: stretch;
      }

      ag-grid-angular {
        height: 100%;
      }
    `
  ]
})
class TestingWithConfigComponent {
  public readonly gridOptions: GridOptions = {
    defaultColDef: {
      resizable: true,
      sortable: true
    },
    columnDefs: [
      {
        field: 'id',
        headerName: '',
        colId: 'selection',
        checkboxSelection: true,
        headerCheckboxSelection: true,
        width: 60,
        pinned: 'left',
        resizable: false
      },
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
    ],
    getRowId: (params: GetRowIdParams<Item>) => params.data.id?.toString() ?? '',
    rowSelection: 'multiple'
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
    },
    {
      id: 3,
      title: 'Third title',
      description: 'Description for the third item'
    }
  ];

  public config: NgssmAgGridConfig = {
    gridId: 'items',
    keepSelection: true
  };
}

describe('NgssmAgGridDirective', () => {
  let store: StoreMock;

  beforeEach(() => {
    store = new StoreMock({ [AgGridStateSpecification.featureStateKey]: AgGridStateSpecification.initialState });
  });

  describe('when using string as directive config', () => {
    let fixture: ComponentFixture<TestingComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [AgGridModule, NgssmAgGridDirective],
        declarations: [TestingComponent],
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
        let state = store.stateValue;
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
        store.stateValue = state;

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
        let state = store.stateValue;
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
        store.stateValue = state;

        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();
      });

      it('should update the grid when the state update has other as origin', async () => {
        let state = store.stateValue;
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
        store.stateValue = state;

        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();

        const agGrid = fixture.debugElement.query(By.css('ag-grid-angular')).injector.get(AgGridAngular);
        expect(agGrid).toBeTruthy();
        const orderedColumns = agGrid.columnApi.getColumnState().map((c) => c.colId);
        expect(orderedColumns).toEqual(['description', 'id', 'title']);
      });

      it('should not update the grid when the state update has agGrid as origin', async () => {
        let state = store.stateValue;
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
        store.stateValue = state;

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

  describe('when using object as directive config', () => {
    let fixture: ComponentFixture<TestingWithConfigComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [AgGridModule, NgssmAgGridDirective],
        declarations: [TestingWithConfigComponent],
        providers: [{ provide: Store, useValue: store }]
      }).compileComponents();

      fixture = TestBed.createComponent(TestingWithConfigComponent);

      fixture.detectChanges();
    });

    it('should create an instance', () => {
      const directive = fixture.debugElement.queryAll(By.directive(NgssmAgGridDirective))[0].injector.get(NgssmAgGridDirective);
      expect(directive).toBeTruthy();
    });

    [ChangeOrigin.agGrid, ChangeOrigin.other].forEach((origin) => {
      it(`should initialize the grid column state when the state has been updated by '${origin}' `, async () => {
        let state = store.stateValue;
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
        store.stateValue = state;

        fixture.detectChanges();
        await fixture.whenStable();

        const agGrid = fixture.debugElement.query(By.css('ag-grid-angular')).injector.get(AgGridAngular);
        expect(agGrid).toBeTruthy();
        const orderedColumns = agGrid.columnApi
          .getColumnState()
          .filter((c) => c.pinned !== 'left')
          .map((c) => c.colId);
        expect(orderedColumns).toEqual(['description', 'title', 'id']);
      });
    });

    [ChangeOrigin.agGrid, ChangeOrigin.other].forEach((origin) => {
      it(`should initialize the selected rows when the state has been updated by '${origin}' `, async () => {
        let state = store.stateValue;
        state = updateAgGridState(state, {
          selectedRows: {
            items: {
              $set: {
                origin,
                ids: ['1', '3']
              }
            }
          }
        });
        store.stateValue = state;

        fixture.detectChanges();
        await fixture.whenStable();

        const agGrid = fixture.debugElement.query(By.css('ag-grid-angular')).injector.get(AgGridAngular);
        expect(agGrid).toBeTruthy();
        const selectedRows = agGrid.api
          .getSelectedNodes()
          .map((n) => n.id ?? '')
          .filter((n) => n !== '');
        expect(selectedRows).toEqual(['1', '3']);
      });
    });

    describe('when state has been already initialized', () => {
      beforeEach(async () => {
        let state = store.stateValue;
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
          },
          selectedRows: {
            items: {
              $set: {
                origin: ChangeOrigin.other,
                ids: ['1', '3']
              }
            }
          }
        });
        store.stateValue = state;

        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();
      });

      it('should update the grid when the state update has other as origin', async () => {
        let state = store.stateValue;
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
        store.stateValue = state;

        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();

        const agGrid = fixture.debugElement.query(By.css('ag-grid-angular')).injector.get(AgGridAngular);
        expect(agGrid).toBeTruthy();
        const orderedColumns = agGrid.columnApi
          .getColumnState()
          .filter((c) => c.pinned !== 'left')
          .map((c) => c.colId);
        expect(orderedColumns).toEqual(['description', 'id', 'title']);
      });

      it('should not update the grid when the state update has agGrid as origin', async () => {
        let state = store.stateValue;
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
        store.stateValue = state;

        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();

        const agGrid = fixture.debugElement.query(By.css('ag-grid-angular')).injector.get(AgGridAngular);
        expect(agGrid).toBeTruthy();
        const orderedColumns = agGrid.columnApi
          .getColumnState()
          .filter((c) => c.pinned !== 'left')
          .map((c) => c.colId);
        expect(orderedColumns).toEqual(['description', 'title', 'id']);
      });

      it('should update the selected rows when the state update has other as origin', async () => {
        let state = store.stateValue;
        state = updateAgGridState(state, {
          selectedRows: {
            items: {
              $set: {
                origin: ChangeOrigin.other,
                ids: ['2', '3']
              }
            }
          }
        });
        store.stateValue = state;

        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();

        const agGrid = fixture.debugElement.query(By.css('ag-grid-angular')).injector.get(AgGridAngular);
        expect(agGrid).toBeTruthy();
        const selectedRows = agGrid.api
          .getSelectedNodes()
          .map((n) => n.id ?? '')
          .filter((n) => n !== '');
        expect(selectedRows).toEqual(['2', '3']);
      });

      it('should not update the grid when the state update has agGrid as origin', async () => {
        let state = store.stateValue;
        state = updateAgGridState(state, {
          selectedRows: {
            items: {
              $set: {
                origin: ChangeOrigin.agGrid,
                ids: ['2', '3']
              }
            }
          }
        });
        store.stateValue = state;

        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();

        const agGrid = fixture.debugElement.query(By.css('ag-grid-angular')).injector.get(AgGridAngular);
        expect(agGrid).toBeTruthy();
        const selectedRows = agGrid.api
          .getSelectedNodes()
          .map((n) => n.id ?? '')
          .filter((n) => n !== '');
        expect(selectedRows).toEqual(['1', '3']);
      });
    });
  });
});
