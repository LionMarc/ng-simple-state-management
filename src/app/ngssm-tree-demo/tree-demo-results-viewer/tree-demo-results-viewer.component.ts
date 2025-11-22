import { Component, ChangeDetectionStrategy, signal, computed, inject } from '@angular/core';

import { GetRowIdParams, GridOptions, ValueGetterParams } from 'ag-grid-community';
import { AgGridModule } from 'ag-grid-angular';

import { createSignal, Store } from 'ngssm-store';
import { NgssmTreeNode, selectNgssmTreeState } from 'ngssm-tree';
import { NgssmAgGridConfig, NgssmAgGridDirective, NgssmAgGridThemeDirective } from 'ngssm-ag-grid';

@Component({
  selector: 'ngssm-tree-demo-results-viewer',
  imports: [AgGridModule, NgssmAgGridDirective, NgssmAgGridThemeDirective],
  templateUrl: './tree-demo-results-viewer.component.html',
  styleUrls: ['./tree-demo-results-viewer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TreeDemoResultsViewerComponent {
  private readonly store = inject(Store);

  private readonly treeId = signal<string | undefined>(undefined);
  private readonly trees = createSignal((state) => selectNgssmTreeState(state).trees);
  private readonly matchingNodes = createSignal((state) => selectNgssmTreeState(state).treeNodesSearch.matchingNodes);

  public readonly nodes = computed<NgssmTreeNode[]>(() => {
    const currentTreeId = this.treeId();
    if (!currentTreeId) {
      return [];
    }

    return (this.trees()[currentTreeId]?.nodes ?? []).filter((n) => (this.matchingNodes() ?? []).includes(n.node.nodeId));
  });

  public readonly gridOptions: GridOptions = {
    defaultColDef: {
      resizable: true,
      sortable: true
    },
    columnDefs: [
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
    gridId: 'ngssm-tree-demo:search-results-viewer',
    keepSelection: false,
    canSaveOnDiskColumnStates: true
  };

  constructor() {
    const treeState = selectNgssmTreeState(this.store.state());
    this.treeId.set(treeState.treeNodesSearch.treeId);
  }
}
