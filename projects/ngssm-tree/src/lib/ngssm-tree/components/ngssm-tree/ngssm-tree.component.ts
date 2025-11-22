import { Component, ChangeDetectionStrategy, inject, input, effect, signal, untracked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { createSignal, Store } from 'ngssm-store';
import { DataStatus } from 'ngssm-remote-data';

import { NgssmTree, NgssmTreeConfig, NgssmTreeNode, NodeData } from '../../model';
import { selectNgssmTreeState } from '../../state';
import { CollapseNodeAction, DisplaySearchDialogAction, ExpandNodeAction, SelectNodeAction } from '../../actions';

interface DisplayedNode {
  node: NgssmTreeNode;
  canSearch: boolean;
}

@Component({
  selector: 'ngssm-tree',
  imports: [CommonModule, ScrollingModule, MatCardModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './ngssm-tree.component.html',
  styleUrls: ['./ngssm-tree.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NgssmTreeComponent {
  public readonly treeConfig = input<NgssmTreeConfig | undefined | null>();

  protected readonly dataStatus = DataStatus;
  protected readonly displayedItems = signal<DisplayedNode[]>([]);
  protected readonly selectedNodeId = signal<string | undefined>(undefined);

  private readonly store = inject(Store);
  private readonly trees = createSignal((state) => selectNgssmTreeState(state).trees);
  private readonly tree = signal<NgssmTree | undefined>(undefined);

  constructor() {
    effect(() => {
      const currentConfig = this.treeConfig();
      const currentTrees = this.trees();
      if (currentConfig) {
        this.tree.set(currentTrees[currentConfig.treeId]);
      } else {
        this.tree.set(undefined);
      }
    });

    effect(() => {
      const currentTree = this.tree();
      const config = untracked(() => this.treeConfig());
      if (!currentTree || !config) {
        this.displayedItems.set([]);
        return;
      }

      const alwaysTrue = () => true;
      const filter: (node: NodeData) => boolean = config.filter ?? alwaysTrue;
      const canSearch: (node: NodeData) => boolean = config.canSearch ?? alwaysTrue;

      const items: DisplayedNode[] = [];
      let hiddenLevel = -1;
      const nodesToFindSelected = new Map<string, { isDisplayed: boolean; node: NgssmTreeNode }>();
      (currentTree.nodes ?? []).forEach((t) => {
        if (t.node.isExpandable && t.isExpanded === false && hiddenLevel === -1) {
          hiddenLevel = t.level;
        }

        if (hiddenLevel === -1 || t.level <= hiddenLevel) {
          if (filter(t.node)) {
            items.push({
              node: t,
              canSearch: canSearch(t.node)
            });
            nodesToFindSelected.set(t.node.nodeId, { isDisplayed: true, node: t });
          }
        }

        if (t.node.isExpandable && t.level <= hiddenLevel) {
          hiddenLevel = t.isExpanded === true ? -1 : t.level;
        }

        if (!nodesToFindSelected.has(t.node.nodeId)) {
          nodesToFindSelected.set(t.node.nodeId, { isDisplayed: false, node: t });
        }
      });

      this.displayedItems.set(items);

      let selectedNode = currentTree.selectedNode;
      if (!selectedNode) {
        this.selectedNodeId.set(undefined);
      } else {
        while (selectedNode) {
          const item = nodesToFindSelected.get(selectedNode);
          if (item?.isDisplayed !== true) {
            selectedNode = item?.node.node.parentNodeId;
          } else {
            break;
          }
        }

        this.selectedNodeId.set(selectedNode);
      }
    });
  }

  protected getItemId(_: number, node: DisplayedNode): string {
    return node.node.node.nodeId;
  }

  protected expand(node: NgssmTreeNode): void {
    const treeId = this.treeConfig()?.treeId;
    if (treeId) {
      this.store.dispatchAction(new ExpandNodeAction(treeId, node.node.nodeId));
    }
  }

  protected collapse(node: NgssmTreeNode): void {
    const treeId = this.treeConfig()?.treeId;
    if (treeId) {
      this.store.dispatchAction(new CollapseNodeAction(treeId, node.node.nodeId));
    }
  }

  protected selectNode(node: NgssmTreeNode): void {
    const treeId = this.treeConfig()?.treeId;
    if (treeId) {
      this.store.dispatchAction(new SelectNodeAction(treeId, node.node.nodeId));
    }
  }

  protected displaySearchDialog(node: NgssmTreeNode): void {
    const treeId = this.treeConfig()?.treeId;
    if (treeId) {
      this.store.dispatchAction(new DisplaySearchDialogAction(treeId, node.node.nodeId));
    }
  }
}
