import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { BehaviorSubject, Observable } from 'rxjs';

import { GetRowIdParams, GridOptions, ICellRendererParams, MenuItemDef, ValueGetterParams } from 'ag-grid-community';
import { AgGridModule } from 'ag-grid-angular';

import { NgSsmComponent, Store } from 'ngssm-store';
import {
  getColDefForEditableColumn,
  getColDefWithNoPadding,
  getNgssmActionsCellColDef,
  NgssmAgGridConfig,
  NgssmAgGridDirective,
  NgssmAgGridThemeDirective
} from 'ngssm-ag-grid';
import { NgssmComponentOverlayDirective } from 'ngssm-toolkit';
import { NgssmDataReloadButtonComponent, NgssmDataSourceValueStatus, selectNgssmDataSourceValue } from 'ngssm-data';

import { TodoItem, todoItemsKey } from '../../model';
import { EditTodoItemAction, TodoActionType } from '../../actions';
import { TodoItemComponent } from '../todo-item/todo-item.component';
import { provideFeatureState } from '../../feature-state-provider';

@Component({
    selector: 'app-todo-dashboard',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatCardModule,
        MatButtonModule,
        MatCheckboxModule,
        AgGridModule,
        NgssmAgGridDirective,
        NgssmAgGridThemeDirective,
        NgssmComponentOverlayDirective,
        NgssmDataReloadButtonComponent,
        TodoItemComponent
    ],
    templateUrl: './todo-dashboard.component.html',
    styleUrls: ['./todo-dashboard.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [provideFeatureState('todo-dashboard', {})]
})
export class TodoDashboardComponent extends NgSsmComponent {
  private readonly _deleteHidden$ = new BehaviorSubject<boolean>(false);

  public readonly waitingOverlayRendered = signal<boolean>(false);
  public readonly todoItems = signal<TodoItem[]>([]);
  public readonly allowRestoringGridControl = new FormControl(true);
  public readonly gridOptions: GridOptions = {
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
        ...getNgssmActionsCellColDef({
          actions: [
            {
              cssClass: 'fa-solid fa-pen-to-square',
              color: 'primary',
              isDisabled: (params: ICellRendererParams<TodoItem, TodoItem>) => (params.data?.id ?? -1) < 2,
              click: (params: ICellRendererParams<TodoItem, TodoItem>) => {
                if (params.data?.id) {
                  this.dispatchAction(new EditTodoItemAction(params.data.id));
                }
              },
              tooltip: 'Edit to-do'
            },
            {
              cssClass: 'fa-solid fa-question',
              color: 'accent',
              isDisabled: (params: ICellRendererParams<TodoItem, TodoItem>) => (params.data?.id ?? -1) === 2,
              isHidden: (params: ICellRendererParams<TodoItem, TodoItem>) => params.data?.title?.includes('READ') ?? false,
              click: (params: ICellRendererParams<TodoItem, TodoItem>) => {
                console.log('Column action called.', params);
              }
            },
            {
              cssClass: 'fa-solid fa-trash-can',
              color: 'accent',
              isHidden: this._deleteHidden$,
              click: (params: ICellRendererParams<TodoItem, TodoItem>) => {
                console.log('Column delete called.', params);
              }
            },
            {
              cssClass: 'fa-solid fa-comment',
              color: 'accent',
              click: (params: ICellRendererParams<TodoItem, TodoItem>) => {
                this.router.navigate(['tree-demo']);
              },
              tooltip: 'To test ag-grid 31.0.2 => optimization by execution outside ng zone'
            }
          ]
        }),
        ...getColDefWithNoPadding(),
        valueGetter: (params: ValueGetterParams<TodoItem>) => params.data,
        headerName: 'actions',
        colId: 'actions',
        width: 180,
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
        ...getColDefForEditableColumn(),
        field: 'title',
        headerName: 'Title',
        filter: 'agTextColumnFilter',
        width: 800
      }
    ],
    getRowId: (params: GetRowIdParams<TodoItem>) => params.data.id?.toString() ?? '',
    rowSelection: 'multiple'
  };

  public readonly remoteDataKey = todoItemsKey;
  public readonly deleteHiddenControl = new FormControl<boolean>(false);

  public agGridConfig: NgssmAgGridConfig = {
    gridId: 'todo-items',
    keepSelection: true,
    canSaveOnDiskColumnsState: true,
    getContextMenuItems: (params) => {
      console.log('CALLED', params);
      const menuItems: (string | MenuItemDef)[] = [...(params.defaultItems ?? [])];
      const exportMenuItem: MenuItemDef = {
        name: 'Export',
        icon: '<span class="ag-icon ag-icon-save"></span>',
        subMenu: [
          'csvExport',
          'excelExport',
          {
            name: 'Custom',
            action: () => {
              console.log('Custom export called');
            }
          }
        ]
      };
      const index = menuItems.findIndex((m) => m === 'export');
      if (index) {
        menuItems.splice(index, 1, exportMenuItem);
      } else {
        menuItems.push(exportMenuItem);
      }

      return menuItems;
    }
  };

  constructor(
    store: Store,
    private router: Router
  ) {
    super(store);

    console.log('CALLED ctor of dashboard');

    this.allowRestoringGridControl.valueChanges.subscribe((value) => {
      this.agGridConfig = { ...this.agGridConfig, canSaveOnDiskColumnsState: value ?? true };
    });

    this.deleteHiddenControl.valueChanges.subscribe((v) => this._deleteHidden$.next(v ?? false));

    this.watch((s) => selectNgssmDataSourceValue<TodoItem[]>(s, todoItemsKey)?.value).subscribe((v) => this.todoItems.set(v ?? []));
    this.watch((s) => selectNgssmDataSourceValue<TodoItem[]>(s, todoItemsKey)?.status).subscribe((s) =>
      this.waitingOverlayRendered.set(s === NgssmDataSourceValueStatus.loading)
    );
  }

  public addTodo(): void {
    this.dispatchActionType(TodoActionType.addTodoItem);
  }
}
