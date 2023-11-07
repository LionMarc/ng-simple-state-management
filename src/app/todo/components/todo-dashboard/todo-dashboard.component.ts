import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { BehaviorSubject, Observable } from 'rxjs';

import { GetContextMenuItems, GetRowIdParams, GridOptions, ICellRendererParams, MenuItemDef, ValueGetterParams } from 'ag-grid-community';
import { AgGridModule } from 'ag-grid-angular';

import { DataStatus, NgssmRemoteDataReloadButtonComponent, selectRemoteData } from 'ngssm-remote-data';
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

import { TodoItem, todoItemsKey } from '../../model';
import { EditTodoItemAction, TodoActionType } from '../../actions';
import { TodoItemComponent } from '../todo-item/todo-item.component';

@Component({
  selector: 'app-todo-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatCheckboxModule,
    AgGridModule,
    NgssmAgGridDirective,
    NgssmAgGridThemeDirective,
    NgssmRemoteDataReloadButtonComponent,
    NgssmComponentOverlayDirective,
    TodoItemComponent
  ],
  templateUrl: './todo-dashboard.component.html',
  styleUrls: ['./todo-dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoDashboardComponent extends NgSsmComponent {
  private readonly _deleteHidden$ = new BehaviorSubject<boolean>(false);
  private readonly _todoItems$ = new BehaviorSubject<TodoItem[]>([]);

  public readonly dataStatus = DataStatus;
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
            }
          ]
        }),
        ...getColDefWithNoPadding(),
        valueGetter: (params: ValueGetterParams<TodoItem>) => params.data,
        headerName: 'actions',
        colId: 'actions',
        width: 160,
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

  constructor(store: Store) {
    super(store);

    this.allowRestoringGridControl.valueChanges.subscribe((value) => {
      this.agGridConfig = { ...this.agGridConfig, canSaveOnDiskColumnsState: value ?? true };
    });

    this.deleteHiddenControl.valueChanges.subscribe((v) => this._deleteHidden$.next(v ?? false));

    this.watch((s) => selectRemoteData(s, todoItemsKey)?.data).subscribe((v) => this._todoItems$.next(v ?? []));
  }

  public get status$(): Observable<DataStatus> {
    return this.watch((s) => selectRemoteData(s, todoItemsKey)?.status ?? DataStatus.none);
  }

  public get todoItemIds$(): Observable<number[]> {
    return this.watch((s) => (selectRemoteData(s, todoItemsKey)?.data ?? []).map((t: TodoItem) => t.id));
  }

  public get todoItems$(): Observable<TodoItem[]> {
    return this._todoItems$.asObservable();
  }

  public addTodo(): void {
    this.dispatchActionType(TodoActionType.addTodoItem);
  }
}
