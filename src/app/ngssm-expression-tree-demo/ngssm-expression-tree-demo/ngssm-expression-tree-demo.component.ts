import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { NgSsmComponent, Store } from 'ngssm-store';
import {
  CutAndPasteTarget,
  NgssmExpressionTreeComponent,
  NgssmExpressionTreeConfig,
  NgssmExpressionTreeNode,
  NgssmInitExpressionTreeAction,
  NgssmNode
} from 'ngssm-tree';

import { Filter, getFilterDescription, getFilterLabel } from '../filter';
import { demoTreeId, initialExpression, setNodesFromFilter } from '../init-expression-tree-demo-data';
import { GroupFilterComponent } from '../group-filter/group-filter.component';
import { NodeDetailComponent } from '../node-detail/node-detail.component';
import { JsonBuilderComponent } from '../json-builder/public-api';
import { Entry, databases } from '../database';

@Component({
    selector: 'app-ngssm-expression-tree-demo',
    imports: [CommonModule, MatCardModule, MatIconModule, NgssmExpressionTreeComponent, JsonBuilderComponent],
    templateUrl: './ngssm-expression-tree-demo.component.html',
    styleUrls: ['./ngssm-expression-tree-demo.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NgssmExpressionTreeDemoComponent extends NgSsmComponent {
  public readonly treeConfig: NgssmExpressionTreeConfig<Filter> = {
    treeId: 'demo-expression-tree',
    disableVirtualization: true,
    expandIconClass: 'fa-solid fa-square-plus',
    collapseIconClass: 'fa-solid fa-square-minus',
    getNodeLabel: (_, data) => getFilterLabel(data),
    getNodeDescription: (_, data) => getFilterDescription(data),
    nodeDescriptionComponent: GroupFilterComponent,
    nodeDetailComponent: NodeDetailComponent
  };

  public readonly databaseTreeConfig: NgssmExpressionTreeConfig<Entry> = {
    treeId: 'database-tree',
    disableVirtualization: false,
    expandIconClass: 'fa-solid fa-square-plus',
    collapseIconClass: 'fa-solid fa-square-minus',
    getNodeLabel: (_, data) => data.name,
    getNodeCssIcon: (_, data) => {
      switch (data.type) {
        case 'Database':
          return 'fa-solid fa-database';

        case 'Table':
          return 'fa-solid fa-table';

        default:
          return undefined;
      }
    },
    displayCutAndPasteMenus: true,
    canPaste: (node: NgssmExpressionTreeNode<Entry>, targetNode: NgssmExpressionTreeNode<Entry>, target: CutAndPasteTarget) => {
      switch (node.data.data.type) {
        case 'Database': {
          if (target === 'Inside' || targetNode.data.data.type !== 'Database') {
            return false;
          }

          return true;
        }

        case 'Table': {
          return (
            (target === 'Inside' && targetNode.data.data.type === 'Database') ||
            (target === 'After' && targetNode.data.data.type === 'Table')
          );
        }

        case 'Column': {
          return (
            (target === 'Inside' && targetNode.data.data.type === 'Table') || (target === 'After' && targetNode.data.data.type === 'Column')
          );
        }
      }

      return false;
    }
  };

  constructor(store: Store) {
    super(store);

    const nodes: NgssmNode<Filter>[] = [];

    let nextId = 1;
    initialExpression.forEach((exp) => {
      nextId = setNodesFromFilter(exp, [], nextId, nodes);
    });

    setTimeout(() => {
      this.dispatchAction(new NgssmInitExpressionTreeAction(demoTreeId, nodes));
    });

    nextId = 0;
    const databaseNodes: NgssmNode<Entry>[] = [];
    databases.forEach((database) => {
      nextId++;
      const databaseId = nextId.toString();
      databaseNodes.push({
        id: databaseId,
        parentId: undefined,
        isExpandable: true,
        hasRowDetail: false,
        data: database
      });
      database.tables.forEach((table) => {
        nextId++;
        const tableId = nextId.toString();
        databaseNodes.push({
          id: tableId,
          parentId: databaseId,
          isExpandable: true,
          hasRowDetail: false,
          data: table
        });
        table.columns.forEach((column) => {
          nextId++;
          databaseNodes.push({
            id: nextId.toString(),
            parentId: tableId,
            isExpandable: false,
            hasRowDetail: false,
            data: column
          });
        });
      });
    });

    this.dispatchAction(new NgssmInitExpressionTreeAction(this.databaseTreeConfig.treeId, databaseNodes));
  }
}
