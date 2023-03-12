import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { NgSsmComponent, Store } from 'ngssm-store';
import { NgssmExpressionTreeComponent, NgssmExpressionTreeConfig } from 'ngssm-expression-tree';
import { Filter, getFilterDescription, getFilterLabel } from '../filter';

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
    getNodeLabel: (node) => getFilterLabel(node.data.data),
    getNodeDescription: (node) => getFilterDescription(node.data.data)
  };
  constructor(store: Store) {
    super(store);
  }
}
