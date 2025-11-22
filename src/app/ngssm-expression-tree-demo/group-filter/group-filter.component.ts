import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { createSignal } from 'ngssm-store';
import { NgssmExpressionTreeCustomComponent, selectNgssmExpressionTreeState } from 'ngssm-tree';

import { Filter, FilterType } from '../filter';

interface Config {
  nodeId: string;
  treeId: string;
}

@Component({
  selector: 'ngssm-group-filter',
  imports: [MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './group-filter.component.html',
  styleUrls: ['./group-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GroupFilterComponent implements NgssmExpressionTreeCustomComponent {
  public readonly config = signal<Config | undefined>(undefined);
  public readonly mustBeDisplayed = computed(() => {
    const currentConfig = this.config();
    if (!currentConfig) {
      return false;
    }

    const item = this.trees()[currentConfig.treeId]?.data[currentConfig.nodeId] as Filter;
    return item.type === FilterType.and || item.type === FilterType.or;
  });

  private readonly trees = createSignal((state) => selectNgssmExpressionTreeState(state).trees);

  constructor() {
    console.log('GroupFilterComponent - constructor');
  }

  public setup(treeId: string, nodeId: string): void {
    console.log('GroupFilterComponent', treeId, nodeId, this.config());
    this.config.set({ nodeId, treeId });
  }
}
