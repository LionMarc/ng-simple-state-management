import { Component, ChangeDetectionStrategy, ChangeDetectorRef, inject, input, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';

import { createSignal, Store } from 'ngssm-store';

import { NgssmExpressionTreeConfig, NgssmExpressionTreeNode } from '../../model';
import { selectNgssmExpressionTreeState } from '../../state';
import { NgssmCollapseExpressionTreeNodeAction, NgssmExpandExpressionTreeNodeAction } from '../../actions';
import { NgssmExpressionTreeNodeComponent } from '../ngssm-expression-tree-node/ngssm-expression-tree-node.component';
import { NgssmExpressionTreeNodeDetailsComponent } from '../ngssm-expression-tree-node-details/ngssm-expression-tree-node-details.component';

@Component({
  selector: 'ngssm-expression-tree',
  imports: [
    CommonModule,
    ScrollingModule,
    MatCard,
    MatCardContent,
    MatDivider,
    MatIcon,
    NgssmExpressionTreeNodeComponent,
    NgssmExpressionTreeNodeDetailsComponent
  ],
  templateUrl: './ngssm-expression-tree.component.html',
  styleUrls: ['./ngssm-expression-tree.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NgssmExpressionTreeComponent<T = unknown> {
  private readonly store = inject(Store);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);

  private readonly trees = createSignal((state) => selectNgssmExpressionTreeState(state).trees);

  public readonly treeConfig = input<NgssmExpressionTreeConfig<T> | null | undefined, NgssmExpressionTreeConfig<T> | null | undefined>(
    undefined,
    {
      transform: (value) => {
        if (!value) {
          return value;
        }

        const config: NgssmExpressionTreeConfig<T> = {
          ...value
        };
        if (!config.getNodeLabel) {
          config.getNodeLabel = (node) => node.data.id;
        }

        if (!config.expandIconClass) {
          config.expandIconClass = 'fa-solid fa-chevron-right';
        }

        if (!config.collapseIconClass) {
          config.collapseIconClass = 'fa-solid fa-chevron-down';
        }

        return config;
      }
    }
  );
  public readonly displayedNodes = signal<NgssmExpressionTreeNode[]>([]);

  constructor() {
    effect(() => {
      const config = this.treeConfig();
      if (!config) {
        this.displayedNodes.set([]);
        return;
      }

      const nodes: NgssmExpressionTreeNode[] = [];
      const collapsedNodes = new Set<string>();
      (this.trees()[config.treeId]?.nodes ?? []).forEach((node) => {
        if (node.data.isExpandable === true && node.isExpanded === false) {
          collapsedNodes.add(node.data.id);
        }

        if (!node.data.parentId || node.path.findIndex((p) => collapsedNodes.has(p)) === -1) {
          nodes.push(node);
        }
      });

      this.displayedNodes.set(nodes);
    });
  }

  public getItemId(_: number, node: NgssmExpressionTreeNode): string {
    return node.data.id;
  }

  public expand(node: NgssmExpressionTreeNode): void {
    const treeId = this.treeConfig()?.treeId;
    if (treeId) {
      this.store.dispatchAction(new NgssmExpandExpressionTreeNodeAction(treeId, node.data.id));
    }
  }

  public collapse(node: NgssmExpressionTreeNode): void {
    const treeId = this.treeConfig()?.treeId;
    if (treeId) {
      this.store.dispatchAction(new NgssmCollapseExpressionTreeNodeAction(treeId, node.data.id));
    }
  }

  public forceRefresh(): void {
    this.changeDetectorRef.markForCheck();
  }
}
