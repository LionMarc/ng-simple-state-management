import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';

import { AgGridModule } from 'ag-grid-angular';
import { CellClickedEvent, GetRowIdParams, GridOptions, ValueGetterParams } from 'ag-grid-community';

import { NgSsmComponent, Store } from 'ngssm-store';
import {
  NgssmBreadcrumbComponent,
  NgssmTreeComponent,
  NgssmTreeConfig,
  NodeData,
  selectNgssmTreeState,
  SelectNodeAction
} from 'ngssm-tree';
import { NgssmAgGridConfig, NgssmAgGridDirective, NgssmAgGridThemeDirective } from 'ngssm-ag-grid';

@Component({
  selector: 'app-ngssm-tree-demo',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    AgGridModule,
    NgssmTreeComponent,
    NgssmBreadcrumbComponent,
    NgssmAgGridDirective,
    NgssmAgGridThemeDirective
  ],
  templateUrl: './ngssm-tree-demo.component.html',
  styleUrls: ['./ngssm-tree-demo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NgssmTreeDemoComponent extends NgSsmComponent {
  private readonly _selectedNodeChildren$ = new BehaviorSubject<NodeData[]>([]);

  public readonly treeConfig: NgssmTreeConfig = {
    treeId: 'demo',
    iconClasses: {
      directory: 'fa-solid fa-folder',
      file: 'fa-regular fa-file'
    }
  };

  public readonly treeConfigForFolders: NgssmTreeConfig = {
    treeId: 'demo',
    iconClasses: {
      directory: 'fa-solid fa-folder',
      file: 'fa-regular fa-file'
    },
    filter: (node: NodeData) => node.type === 'directory'
  };

  public readonly gridOptions: GridOptions = {
    defaultColDef: {
      resizable: true,
      sortable: true
    },
    columnDefs: [
      {
        valueGetter: (params: ValueGetterParams<NodeData>) => params.data?.nodeId,
        headerName: 'Id',
        filter: 'agTextColumnFilter',
        width: 80,
        onCellClicked: (event: CellClickedEvent<NodeData>) => {
          const nodeId = event.data?.nodeId;
          if (nodeId) {
            this.dispatchAction(new SelectNodeAction('demo', nodeId));
          }
        }
      },
      {
        valueGetter: (params: ValueGetterParams<NodeData>) => params.data?.type,
        headerName: 'Type',
        filter: 'agTextColumnFilter',
        width: 200
      },
      {
        valueGetter: (params: ValueGetterParams<NodeData>) => params.data?.label,
        headerName: 'Label',
        filter: 'agTextColumnFilter',
        width: 200
      }
    ],
    getRowId: (params: GetRowIdParams<NodeData>) => params.data.nodeId
  };

  public agGridConfig: NgssmAgGridConfig = {
    gridId: 'tree-selection',
    keepSelection: false,
    canSaveOnDiskColumnsState: true
  };

  constructor(store: Store) {
    super(store);

    combineLatest([
      this.watch((s) => selectNgssmTreeState(s).trees['demo']?.nodes),
      this.watch((s) => selectNgssmTreeState(s).trees['demo']?.selectedNode)
    ]).subscribe((values) => {
      if (!values[1]) {
        this._selectedNodeChildren$.next([]);
        return;
      }

      this._selectedNodeChildren$.next((values[0] ?? []).filter((v) => v.node.parentNodeId === values[1]).map((v) => v.node));
    });
  }

  public get selectedNodeChildren$(): Observable<NodeData[]> {
    return this._selectedNodeChildren$.asObservable();
  }
}
