import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgSsmComponent, Store } from 'ngssm-store';
import { NgssmExpressionTreeCustomComponent, NgssmExpressionTreeNode, selectNgssmExpressionTreeState } from 'ngssm-tree';

import { Filter } from '../filter';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'app-node-detail',
  imports: [CommonModule],
  templateUrl: './node-detail.component.html',
  styleUrls: ['./node-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NodeDetailComponent extends NgSsmComponent implements NgssmExpressionTreeCustomComponent {
  private readonly _node$ = new BehaviorSubject<Filter | null>(null);

  constructor(store: Store) {
    super(store);
  }

  public get node$(): Observable<Filter | null> {
    return this._node$.asObservable();
  }

  public setup(treeId: string, nodeId: string): void {
    this.watch((s) => selectNgssmExpressionTreeState(s).trees[treeId].data[nodeId]).subscribe((v) => this._node$.next(v));
  }
}
