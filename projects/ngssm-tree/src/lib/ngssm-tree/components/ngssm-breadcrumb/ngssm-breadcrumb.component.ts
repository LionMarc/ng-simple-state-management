import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';

import { NgSsmComponent, Store } from 'ngssm-store';

import { NodeData } from '../../model';
import { selectNgssmTreeState } from '../../state';
import { SelectNodeAction } from '../../actions';

@Component({
    selector: 'ngssm-breadcrumb',
    imports: [CommonModule, MatIconModule, MatButtonModule],
    templateUrl: './ngssm-breadcrumb.component.html',
    styleUrls: ['./ngssm-breadcrumb.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NgssmBreadcrumbComponent extends NgSsmComponent {
  private readonly _treeId$ = new BehaviorSubject<string | undefined>(undefined);
  private readonly _nodes$ = new BehaviorSubject<NodeData[]>([]);

  constructor(store: Store) {
    super(store);

    combineLatest([this._treeId$, this.watch((s) => selectNgssmTreeState(s))]).subscribe((values) => {
      if (!values[0]) {
        this._nodes$.next([]);
        return;
      }

      const tree = values[1]?.trees[values[0]];
      if (!tree) {
        this._nodes$.next([]);
        return;
      }

      const nodesPerId = new Map<string, NodeData>(tree.nodes.map((n) => [n.node.nodeId, n.node]));
      const path: NodeData[] = [];
      let node = tree.selectedNode ? nodesPerId.get(tree.selectedNode) : undefined;
      while (node) {
        path.unshift(node);
        node = node.parentNodeId ? nodesPerId.get(node.parentNodeId) : undefined;
      }

      if (path.length === 0 && tree.nodes.length > 0) {
        path.push(tree.nodes[0]?.node);
      }

      this._nodes$.next(path);
    });
  }

  @Input() public set treeId(value: string) {
    this._treeId$.next(value);
  }

  public get nodes$(): Observable<NodeData[]> {
    return this._nodes$.asObservable();
  }

  public selectNode(node: NodeData): void {
    const treeId = this._treeId$.getValue();
    if (treeId) {
      this.dispatchAction(new SelectNodeAction(treeId, node.nodeId));
    }
  }
}
