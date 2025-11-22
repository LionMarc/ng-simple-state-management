import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

import { createSignal } from 'ngssm-store';
import { NgssmExpressionTreeCustomComponent, selectNgssmExpressionTreeState } from 'ngssm-tree';

import { Filter } from '../filter';

interface Config {
  nodeId: string;
  treeId: string;
}

@Component({
  selector: 'ngssm-node-detail',
  imports: [CommonModule],
  templateUrl: './node-detail.component.html',
  styleUrls: ['./node-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NodeDetailComponent implements NgssmExpressionTreeCustomComponent {
  public readonly node = computed<Filter | null>(() => {
    const currentConfig = this.config();
    if (!currentConfig) {
      return null;
    }

    return this.trees()[currentConfig.treeId].data[currentConfig.nodeId] as Filter;
  });

  private readonly config = signal<Config | undefined>(undefined);
  private readonly trees = createSignal((state) => selectNgssmExpressionTreeState(state).trees);

  public setup(treeId: string, nodeId: string): void {
    this.config.set({ nodeId, treeId });
  }
}
