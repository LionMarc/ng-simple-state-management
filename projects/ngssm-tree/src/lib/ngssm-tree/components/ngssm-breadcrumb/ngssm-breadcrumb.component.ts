import { Component, ChangeDetectionStrategy, inject, input, effect, signal } from '@angular/core';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { createSignal, Store } from 'ngssm-store';

import { NodeData } from '../../model';
import { selectNgssmTreeState } from '../../state';
import { SelectNodeAction } from '../../actions';

@Component({
  selector: 'ngssm-breadcrumb',
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './ngssm-breadcrumb.component.html',
  styleUrls: ['./ngssm-breadcrumb.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NgssmBreadcrumbComponent {
  public readonly treeId = input<string | undefined>(undefined);

  public readonly nodes = signal<NodeData[]>([]);

  private readonly store = inject(Store);
  private readonly treeState = createSignal((state) => selectNgssmTreeState(state));

  constructor() {
    effect(() => {
      const currentTreeId = this.treeId();
      if (!currentTreeId) {
        this.nodes.set([]);
        return;
      }

      const state = this.treeState();

      const tree = state?.trees[currentTreeId];
      if (!tree) {
        this.nodes.set([]);
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

      this.nodes.set(path);
    });
  }

  public selectNode(node: NodeData): void {
    const treeId = this.treeId();
    if (treeId) {
      this.store.dispatchAction(new SelectNodeAction(treeId, node.nodeId));
    }
  }
}
