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
  NgssmTreeNode,
  NodeData,
  selectNgssmTreeState,
  SelectNodeAction
} from 'ngssm-tree';
import { NgssmAgGridConfig, NgssmAgGridDirective, NgssmAgGridThemeDirective } from 'ngssm-ag-grid';

@Component({
    selector: 'app-ngssm-tree-demo',
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
  private readonly _selectedNodeChildren$ = new BehaviorSubject<NgssmTreeNode[]>([]);

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
        valueGetter: (params: ValueGetterParams<NgssmTreeNode>) => params.data?.node.nodeId,
        headerName: 'Id',
        filter: 'agTextColumnFilter',
        width: 80,
        onCellClicked: (event: CellClickedEvent<NgssmTreeNode>) => {
          const nodeId = event.data?.node.nodeId;
          if (nodeId) {
            this.dispatchAction(new SelectNodeAction('demo', nodeId));
          }
        }
      },
      {
        valueGetter: (params: ValueGetterParams<NgssmTreeNode>) => params.data?.node.type,
        headerName: 'Type',
        filter: 'agTextColumnFilter',
        width: 200
      },
      {
        valueGetter: (params: ValueGetterParams<NgssmTreeNode>) => params.data?.node.label,
        headerName: 'Label',
        filter: 'agTextColumnFilter',
        width: 200
      },
      {
        valueGetter: (params: ValueGetterParams<NgssmTreeNode>) => params.data?.parentFullPath,
        headerName: 'Parent path',
        filter: 'agTextColumnFilter',
        width: 400
      }
    ],
    getRowId: (params: GetRowIdParams<NgssmTreeNode>) => params.data.node.nodeId
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

      this._selectedNodeChildren$.next((values[0] ?? []).filter((v) => v.node.parentNodeId === values[1]).map((v) => v));
    });
  }

  public get selectedNodeChildren$(): Observable<NgssmTreeNode[]> {
    return this._selectedNodeChildren$.asObservable();
  }
}
