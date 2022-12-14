import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';

import { GetRowIdParams, GridOptions } from 'ag-grid-community';

import { DataStatus, selectRemoteData } from 'ngssm-remote-data';
import { NgSsmComponent, Store } from 'ngssm-store';
import { NgssmAgGridConfig } from 'ngssm-ag-grid';

import { TodoItem, todoItemsKey } from '../../model';
import { TodoActionType } from '../../actions';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-todo-dashboard',
  templateUrl: './todo-dashboard.component.html',
  styleUrls: ['./todo-dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoDashboardComponent extends NgSsmComponent {
  public readonly dataStatus = DataStatus;
  public readonly allowRestoringGridControl = new FormControl(true);
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
        width: 800
      }
    ],
    getRowId: (params: GetRowIdParams<TodoItem>) => params.data.id?.toString() ?? '',
    rowSelection: 'multiple'
  };

  public agGridConfig: NgssmAgGridConfig = {
    gridId: 'todo-items',
    keepSelection: true,
    canSaveOnDiskColumnsState: true
  };

  constructor(store: Store) {
    super(store);

    this.allowRestoringGridControl.valueChanges.subscribe((value) => {
      this.agGridConfig = { ...this.agGridConfig, canSaveOnDiskColumnsState: value ?? true };
    });
  }

  public get status$(): Observable<DataStatus> {
    return this.watch((s) => selectRemoteData(s, todoItemsKey).status);
  }

  public get todoItemIds$(): Observable<number[]> {
    return this.watch((s) => (selectRemoteData(s, todoItemsKey).data ?? []).map((t: TodoItem) => t.id));
  }

  public get todoItems$(): Observable<TodoItem[]> {
    return this.watch((s) => selectRemoteData(s, todoItemsKey).data ?? []);
  }

  public addTodo(): void {
    this.dispatchActionType(TodoActionType.addTodoItem);
  }
}
