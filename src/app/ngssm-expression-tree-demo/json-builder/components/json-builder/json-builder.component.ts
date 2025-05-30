import { Component, ChangeDetectionStrategy, effect, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

import { createSignal, Store } from 'ngssm-store';
import {
  CutAndPasteTarget,
  NgssmClearExpressionTreeAction,
  NgssmExpressionTree,
  NgssmExpressionTreeComponent,
  NgssmExpressionTreeConfig,
  NgssmExpressionTreeNode,
  NgssmInitExpressionTreeAction,
  selectNgssmExpressionTreeState
} from 'ngssm-tree';

import { JsonNode, JsonNodeType } from '../../model';
import { JsonNodeComponent } from '../json-node/json-node.component';
import { selectJsonBuilderState } from '../../state';
import { JsonBuilderActionType } from '../../actions';

@Component({
  selector: 'ngssm-json-builder',
  imports: [CommonModule, NgssmExpressionTreeComponent],
  templateUrl: './json-builder.component.html',
  styleUrls: ['./json-builder.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class JsonBuilderComponent implements OnDestroy {
  private readonly store = inject(Store);

  public readonly treeConfig: NgssmExpressionTreeConfig<JsonNode> = {
    treeId: 'json-builder-demo',
    rowSize: 40,
    disableVirtualization: true,
    expandIconClass: 'fa-solid fa-square-plus',
    collapseIconClass: 'fa-solid fa-square-minus',
    getNodeLabel: (_, data) => data.name ?? 'Root',
    nodeDescriptionComponent: JsonNodeComponent,
    displayCutAndPasteMenus: true,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    canPaste: (node: NgssmExpressionTreeNode<JsonNode>, targetNode: NgssmExpressionTreeNode<JsonNode>, target: CutAndPasteTarget) => true
  };

  public readonly tree = createSignal<NgssmExpressionTree<JsonNode>>(
    (state) => selectNgssmExpressionTreeState(state).trees[this.treeConfig.treeId] as NgssmExpressionTree<JsonNode>
  );

  constructor() {
    const nextNodeId = selectJsonBuilderState(this.store.state()).nextNodeId;
    this.store.dispatchAction(
      new NgssmInitExpressionTreeAction<JsonNode>(this.treeConfig.treeId, [
        {
          id: `${nextNodeId.toString()}`,
          isExpandable: true,
          data: { type: JsonNodeType.object }
        }
      ])
    );

    this.store.dispatchActionType(JsonBuilderActionType.incrementNextNodeId);

    effect(() => {
      const currentTree = this.tree();
      if (!currentTree) {
        return;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result: any = {};

      currentTree.nodes.forEach((node) => {
        if (node.path.length === 0) {
          return;
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let item: any = result;
        node.path.forEach((id) => {
          const name = currentTree.data[id].name;
          if (name) {
            if (!item[name]) {
              item[name] = {};
            }

            item = item[name];
          }
        });

        const jsonNode = currentTree.data[node.data.id];
        switch (jsonNode.type) {
          case JsonNodeType.object:
            item[jsonNode.name ?? node.data.id] = {};
            break;

          case JsonNodeType.value:
            item[jsonNode.name ?? node.data.id] = node.data.id;
            break;
        }
      });

      console.log('JSON BUILDER', result);
    });
  }

  public ngOnDestroy(): void {
    this.store.dispatchAction(new NgssmClearExpressionTreeAction(this.treeConfig.treeId));
  }
}
