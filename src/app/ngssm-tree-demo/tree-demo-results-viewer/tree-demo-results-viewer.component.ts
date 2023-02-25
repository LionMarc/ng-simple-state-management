import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, combineLatest, Observable, take } from 'rxjs';

import { GetRowIdParams, GridOptions, ValueGetterParams } from 'ag-grid-community';
import { AgGridModule } from 'ag-grid-angular';

import { NgSsmComponent, Store } from 'ngssm-store';
import { NgssmTreeNode, selectNgssmTreeState } from 'ngssm-tree';
import { NgssmAgGridConfig, NgssmAgGridDirective, NgssmAgGridThemeDirective } from 'ngssm-ag-grid';

@Component({
  selector: 'app-tree-demo-results-viewer',
  standalone: true,
  imports: [CommonModule, AgGridModule, NgssmAgGridDirective, NgssmAgGridThemeDirective],
  templateUrl: './tree-demo-results-viewer.component.html',
  styleUrls: ['./tree-demo-results-viewer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TreeDemoResultsViewerComponent extends NgSsmComponent {
  private readonly _nodes$ = new BehaviorSubject<NgssmTreeNode[]>([]);

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
    canSaveOnDiskColumnsState: true
  };

  constructor(store: Store) {
    super(store);

    this.watch((s) => selectNgssmTreeState(s))
      .pipe(take(1))
      .subscribe((value) => {
        const treeId = value.treeNodesSearch.treeId;
        if (!treeId) {
          return;
        }

        combineLatest([
          this.watch((s) => selectNgssmTreeState(s).trees[treeId]),
          this.watch((s) => selectNgssmTreeState(s).treeNodesSearch.matchingNodes)
        ]).subscribe((values) => {
          const nodes = (values[0]?.nodes ?? []).filter((n) => (values[1] ?? []).includes(n.node.nodeId));
          this._nodes$.next(nodes);
        });
      });
  }

  public get nodes$(): Observable<NgssmTreeNode[]> {
    return this._nodes$.asObservable();
  }
}
