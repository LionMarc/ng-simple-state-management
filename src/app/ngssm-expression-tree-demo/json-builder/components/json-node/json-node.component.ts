import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BehaviorSubject, Observable, take } from 'rxjs';

import { NgSsmComponent, Store } from 'ngssm-store';
import { NgssmDeleteExpressionTreeNodeAction, NgssmExpressionTreeCustomComponent, selectNgssmExpressionTreeState } from 'ngssm-tree';

import { JsonNode, JsonNodeType } from '../../model';
import { NewPropertyAction } from '../../actions';

@Component({
  selector: 'ngssm-json-node',
  imports: [CommonModule, MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './json-node.component.html',
  styleUrls: ['./json-node.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class JsonNodeComponent extends NgSsmComponent implements NgssmExpressionTreeCustomComponent {
  private readonly _node$ = new BehaviorSubject<JsonNode | undefined>(undefined);
  private readonly _canDelete$ = new BehaviorSubject<boolean>(false);

  private treeId: string | undefined;
  private nodeId: string | undefined;

  public readonly jsonNodeType = JsonNodeType;

  constructor(store: Store) {
    super(store);
  }

  public get node$(): Observable<JsonNode | undefined> {
    return this._node$.asObservable();
  }

  public get canDelete$(): Observable<boolean> {
    return this._canDelete$.asObservable();
  }

  public setup(treeId: string, nodeId: string): void {
    if (this.treeId) {
      throw new Error('Component already initialized.');
    }

    this.treeId = treeId;
    this.nodeId = nodeId;

    this.watch((s) => selectNgssmExpressionTreeState(s).trees[treeId]?.data[nodeId]).subscribe((v) => this._node$.next(v as JsonNode));
    this.watch((s) => selectNgssmExpressionTreeState(s).trees[treeId]?.nodes)
      .pipe(take(1))
      .subscribe((nodes) => {
        this._canDelete$.next((nodes ?? []).find((n) => n.data.id === nodeId)?.data.parentId !== undefined);
      });
  }

  public newProperty(): void {
    if (this.treeId) {
      this.dispatchAction(new NewPropertyAction(this.treeId, this.nodeId));
    }
  }

  public deleteNode(): void {
    if (this.treeId && this.nodeId) {
      this.dispatchAction(new NgssmDeleteExpressionTreeNodeAction(this.treeId, this.nodeId));
    }
  }
}
