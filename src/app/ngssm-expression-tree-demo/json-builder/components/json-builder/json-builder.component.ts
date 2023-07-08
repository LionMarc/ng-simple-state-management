import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { take } from 'rxjs';

import { NgSsmComponent, Store } from 'ngssm-store';
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
  selector: 'app-json-builder',
  standalone: true,
  imports: [CommonModule, NgssmExpressionTreeComponent],
  templateUrl: './json-builder.component.html',
  styleUrls: ['./json-builder.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class JsonBuilderComponent extends NgSsmComponent {
  public readonly treeConfig: NgssmExpressionTreeConfig<JsonNode> = {
    treeId: 'json-builder-demo',
    rowSize: 40,
    disableVirtualization: true,
    expandIconClass: 'fa-solid fa-square-plus',
    collapseIconClass: 'fa-solid fa-square-minus',
    getNodeLabel: (_, data) => data.name ?? 'Root',
    nodeDescriptionComponent: JsonNodeComponent,
    displayCutAndPasteMenus: true,
    canPaste: (node: NgssmExpressionTreeNode<JsonNode>, targetNode: NgssmExpressionTreeNode<JsonNode>, target: CutAndPasteTarget) => true
  };

  constructor(store: Store) {
    super(store);

    this.watch((s) => selectJsonBuilderState(s).nextNodeId)
      .pipe(take(1))
      .subscribe((v) => {
        this.dispatchAction(
          new NgssmInitExpressionTreeAction<JsonNode>(this.treeConfig.treeId, [
            {
              id: `${v.toString()}`,
              isExpandable: true,
              data: { type: JsonNodeType.object }
            }
          ])
        );

        this.dispatchActionType(JsonBuilderActionType.incrementNextNodeId);
      });

    this.unsubscribeAll$.subscribe(() => this.dispatchAction(new NgssmClearExpressionTreeAction(this.treeConfig.treeId)));

    this.watch((s) => selectNgssmExpressionTreeState(s).trees[this.treeConfig.treeId]).subscribe((tree: NgssmExpressionTree<JsonNode>) => {
      if (!tree) {
        return;
      }

      const result: any = {};

      tree.nodes.forEach((node) => {
        if (node.path.length === 0) {
          return;
        }

        let item: any = result;
        node.path.forEach((id) => {
          const name = tree.data[id].name;
          if (name) {
            if (!item[name]) {
              item[name] = {};
            }

            item = item[name];
          }
        });

        const jsonNode = tree.data[node.data.id];
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
}
