import { Component, ChangeDetectionStrategy, signal, computed, inject } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { createSignal, Store } from 'ngssm-store';
import { NgssmDeleteExpressionTreeNodeAction, NgssmExpressionTreeCustomComponent, selectNgssmExpressionTreeState } from 'ngssm-tree';

import { JsonNode, JsonNodeType } from '../../model';
import { NewPropertyAction } from '../../actions';

interface Config {
  nodeId: string;
  treeId: string;
}

@Component({
  selector: 'ngssm-json-node',
  imports: [MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './json-node.component.html',
  styleUrls: ['./json-node.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class JsonNodeComponent implements NgssmExpressionTreeCustomComponent {
  private readonly store = inject(Store);

  private readonly trees = createSignal((state) => selectNgssmExpressionTreeState(state).trees);

  public readonly config = signal<Config | undefined>(undefined);
  public readonly node = computed<JsonNode | undefined>(() => {
    const currentConfig = this.config();
    if (!currentConfig) {
      return undefined;
    }

    return this.trees()[currentConfig.treeId]?.data[currentConfig.nodeId] as JsonNode;
  });

  public readonly canDelete = signal(false);

  public readonly jsonNodeType = JsonNodeType;

  public setup(treeId: string, nodeId: string): void {
    if (this.config()) {
      throw new Error('Component already initialized.');
    }

    this.config.set({ nodeId, treeId });

    this.canDelete.set(
      (selectNgssmExpressionTreeState(this.store.state()).trees[treeId]?.nodes ?? []).find((n) => n.data.id === nodeId)?.data.parentId !==
        undefined
    );
  }

  public newProperty(): void {
    const currentConfig = this.config();
    if (currentConfig) {
      this.store.dispatchAction(new NewPropertyAction(currentConfig.treeId, currentConfig.nodeId));
    }
  }

  public deleteNode(): void {
    const currentConfig = this.config();
    if (currentConfig) {
      this.store.dispatchAction(new NgssmDeleteExpressionTreeNodeAction(currentConfig.treeId, currentConfig.nodeId));
    }
  }
}
