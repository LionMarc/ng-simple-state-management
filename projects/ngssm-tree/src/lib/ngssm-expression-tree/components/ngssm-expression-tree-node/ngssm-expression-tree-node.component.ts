import { Component, ChangeDetectionStrategy, Type, inject, input, signal, effect, untracked } from '@angular/core';

import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';

import { createSignal, Store } from 'ngssm-store';
import { NgssmComponentAction, NgssmComponentDisplayDirective } from 'ngssm-toolkit';

import { NgssmExpressionTreeConfig, NgssmExpressionTreeCustomComponent, CutAndPasteTarget, NgssmExpressionTree } from '../../model';
import { selectNgssmExpressionTreeState } from '../../state';
import {
  NgssmCancelCutExpressionTreeNodeAction,
  NgssmCollapseAllExpressionTreeNodesAction,
  NgssmCutExpressionTreeNodeAction,
  NgssmExpandAllExpressionTreeNodesAction,
  NgssmPasteExpressionTreeNodeAction
} from '../../actions';

interface CutAndPaste {
  isCutAndPasteInProgress: boolean;
  isPartOfCut: boolean;
  canCut: boolean;
  canPasteInside: boolean;
  canPasteAfter: boolean;
}

const getDefaultCutAndPaste = (): CutAndPaste => ({
  isCutAndPasteInProgress: false,
  isPartOfCut: false,
  canCut: false,
  canPasteInside: false,
  canPasteAfter: false
});

@Component({
  selector: 'ngssm-expression-tree-node',
  imports: [MatIconModule, MatMenuModule, MatDividerModule, NgssmComponentDisplayDirective],
  templateUrl: './ngssm-expression-tree-node.component.html',
  styleUrls: ['./ngssm-expression-tree-node.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NgssmExpressionTreeNodeComponent {
  private readonly store = inject(Store);
  private readonly trees = createSignal((state) => selectNgssmExpressionTreeState(state).trees);
  private readonly tree = signal<NgssmExpressionTree | undefined>(undefined);

  public readonly nodeId = input<string | null | undefined>();
  public readonly treeConfig = input<NgssmExpressionTreeConfig | null | undefined>(undefined);

  public readonly nodeLabel = signal<string>('');
  public readonly nodeCssIcon = signal<string | undefined>(undefined);
  public readonly nodeDescription = signal<string | undefined>(undefined);
  public readonly cutAndPaste = signal<CutAndPaste>(getDefaultCutAndPaste());
  public readonly componentAction = signal<NgssmComponentAction | undefined>(undefined);
  public readonly componentToDisplay = signal<Type<unknown> | undefined>(undefined);

  constructor() {
    effect(() => {
      const currentNodeId = this.nodeId();
      const config = this.treeConfig();
      if (!currentNodeId || !config) {
        this.tree.set(undefined);
        return;
      }

      this.tree.set(this.trees()[config.treeId]);
    });

    effect(() => {
      const currentNodeId = this.nodeId();
      const config = this.treeConfig();
      if (!currentNodeId || !config) {
        return;
      }

      this.componentAction.set((c: unknown) => (c as NgssmExpressionTreeCustomComponent).setup(config.treeId, currentNodeId));
      this.componentToDisplay.set(config.nodeDescriptionComponent);
    });

    effect(() => {
      const currentTree = this.tree();
      const currentNodeId = untracked(() => this.nodeId());
      const currentConfig = untracked(() => this.treeConfig());
      if (!currentNodeId || !currentTree || !currentConfig) {
        return;
      }

      const node = currentTree.nodes.find((v) => v.data.id === currentNodeId);
      const nodeValue = currentTree.data[currentNodeId];
      const cutAndPaste: CutAndPaste = getDefaultCutAndPaste();
      const nodeCut = currentTree.nodeCut;
      if (node && currentConfig && nodeValue) {
        this.nodeLabel.set(currentConfig.getNodeLabel?.(node, nodeValue) ?? '');
        this.nodeCssIcon.set(currentConfig.getNodeCssIcon?.(node, nodeValue) ?? undefined);
        this.nodeDescription.set(currentConfig.getNodeDescription?.(node, nodeValue));
        cutAndPaste.canCut = currentConfig.canCut?.(node) ?? true;

        if (nodeCut) {
          cutAndPaste.isPartOfCut = nodeCut.data.id === node.data.id || node.path.includes(nodeCut.data.id);

          if (!cutAndPaste.isPartOfCut) {
            cutAndPaste.canPasteInside = currentConfig.canPaste?.(nodeCut, node, 'Inside') ?? false;
            cutAndPaste.canPasteAfter = currentConfig.canPaste?.(nodeCut, node, 'After') ?? false;
          }
        }
      }

      cutAndPaste.isCutAndPasteInProgress = !!nodeCut;

      this.cutAndPaste.set(cutAndPaste);
    });
  }

  public expandAll(): void {
    const treeId = this.treeConfig()?.treeId;
    if (treeId) {
      this.store.dispatchAction(new NgssmExpandAllExpressionTreeNodesAction(treeId));
    }
  }

  public collapseAll(): void {
    const treeId = this.treeConfig()?.treeId;
    if (treeId) {
      this.store.dispatchAction(new NgssmCollapseAllExpressionTreeNodesAction(treeId));
    }
  }

  public cut(): void {
    const treeId = this.treeConfig()?.treeId;
    const nodeId = this.nodeId();
    if (treeId && nodeId) {
      this.store.dispatchAction(new NgssmCutExpressionTreeNodeAction(treeId, nodeId));
    }
  }

  public cancelCut(): void {
    const treeId = this.treeConfig()?.treeId;
    if (treeId) {
      this.store.dispatchAction(new NgssmCancelCutExpressionTreeNodeAction(treeId));
    }
  }

  public paste(target: CutAndPasteTarget): void {
    const treeId = this.treeConfig()?.treeId;
    const nodeId = this.nodeId();
    if (treeId && nodeId) {
      this.store.dispatchAction(new NgssmPasteExpressionTreeNodeAction(treeId, nodeId, target));
    }
  }
}
