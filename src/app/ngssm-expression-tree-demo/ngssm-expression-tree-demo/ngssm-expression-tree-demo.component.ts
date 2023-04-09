import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { NgSsmComponent, Store } from 'ngssm-store';
import { NgssmExpressionTreeComponent, NgssmExpressionTreeConfig, NgssmInitExpressionTreeAction, NgssmNode } from 'ngssm-tree';
import { Filter, FilterType, getFilterDescription, getFilterLabel } from '../filter';
import { demoTreeId, initialExpression, setNodesFromFilter } from '../init-expression-tree-demo-data';
import { GroupFilterComponent } from '../group-filter/group-filter.component';
import { NodeDetailComponent } from '../node-detail/node-detail.component';

@Component({
  selector: 'app-ngssm-expression-tree-demo',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, NgssmExpressionTreeComponent],
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
    getNodeDescriptionComponent: (_, data) => {
      if (data.type === FilterType.and || data.type === FilterType.or) {
        return GroupFilterComponent;
      }

      return null;
    },
    getNodeDetailComponent: () => NodeDetailComponent
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
  }
}
