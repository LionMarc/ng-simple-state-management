import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { DefaultMenuItem, GetRowIdParams, GridOptions, ICellRendererParams, MenuItemDef, ValueGetterParams } from 'ag-grid-community';
import { AgGridModule } from 'ag-grid-angular';

import { createSignal, Store } from 'ngssm-store';
import {
  ActionConfirmationPopupComponent,
  ActionConfirmationPopupParameter,
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
import { provideFeatureState } from '../../feature-state-provider';
import { TodoItemComponent } from '../todo-item/todo-item.component';

@Component({
  selector: 'ngssm-todo-dashboard',
  imports: [
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
export class TodoDashboardComponent {
  public readonly deleteHidden = signal<boolean>(false);
  public readonly deleteHiddenControl = new FormControl<boolean>(false);
  public readonly waitingOverlayRendered = createSignal<boolean>(
    (state) => selectNgssmDataSourceValue<TodoItem[]>(state, todoItemsKey)?.status === NgssmDataSourceValueStatus.loading
  );
  public readonly todoItems = createSignal<TodoItem[]>((s) => selectNgssmDataSourceValue<TodoItem[]>(s, todoItemsKey)?.value ?? []);
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
                  this.store.dispatchAction(new EditTodoItemAction(params.data.id));
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
              isHidden: this.deleteHidden,
              popupComponent: ActionConfirmationPopupComponent,
              popupParameter: {
                color: 'warn',
                messageBuilder: (params: ICellRendererParams<TodoItem, TodoItem>) => {
                  return `Are you sure you want to delete "${params.data?.title}"?`;
                },
                cancelButtonLabel: 'No',
                confirmButtonLabel: 'Yes, delete it!',
                confirmAction: (params: ICellRendererParams<TodoItem, TodoItem>) => {
                  if (params.data?.id) {
                    console.log('Deleting item with ID:', params.data.id);
                  }
                }
              } as ActionConfirmationPopupParameter
            },
            {
              cssClass: 'fa-solid fa-comment',
              color: 'accent',
              click: () => {
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
        width: 300
      },
      {
        headerName: 'Status',
        groupId: 'status',
        children: [
          {
            headerName: 'Last Update',
            colId: 'last-update',
            valueGetter: (params: ValueGetterParams<TodoItem>) => params.data?.status?.lastUpdate
          },
          {
            headerName: 'By',
            colId: 'last-updated-by',
            valueGetter: (params: ValueGetterParams<TodoItem>) => params.data?.status?.updatedBy,
            columnGroupShow: 'open'
          }
        ]
      }
    ],
    getRowId: (params: GetRowIdParams<TodoItem>) => params.data.id?.toString() ?? '',
    rowSelection: 'multiple'
  };

  public readonly remoteDataKey = todoItemsKey;

  public agGridConfig: NgssmAgGridConfig = {
    gridId: 'todo-items',
    keepSelection: true,
    canSaveOnDiskColumnStates: true,
    getContextMenuItems: (params) => {
      console.log('CALLED', params);
      const menuItems: (DefaultMenuItem | MenuItemDef)[] = [...(params.defaultItems ?? [])];
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

  private readonly store = inject(Store);
  private readonly router = inject(Router);

  constructor() {
    console.log('CALLED ctor of dashboard');

    this.allowRestoringGridControl.valueChanges.subscribe((value) => {
      this.agGridConfig = { ...this.agGridConfig, canSaveOnDiskColumnStates: value ?? true };
    });

    this.deleteHiddenControl.valueChanges.subscribe((v) => this.deleteHidden.set(v ?? false));
  }

  public addTodo(): void {
    this.store.dispatchActionType(TodoActionType.addTodoItem);
  }
}
