import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgSsmComponent, Store } from 'ngssm-store';
import { NgssmExpressionTreeDescriptionComponent, NgssmExpressionTreeNode } from 'ngssm-tree';

import { Filter } from '../filter';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'app-node-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './node-detail.component.html',
  styleUrls: ['./node-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NodeDetailComponent extends NgSsmComponent implements NgssmExpressionTreeDescriptionComponent<Filter> {
  private readonly _node$ = new BehaviorSubject<NgssmExpressionTreeNode<Filter> | null>(null);

  constructor(store: Store) {
    super(store);
  }

  public get node$(): Observable<NgssmExpressionTreeNode<Filter> | null> {
    return this._node$.asObservable();
  }

  public setNode(value: NgssmExpressionTreeNode<Filter>): void {
    console.log('NodeDetailComponent', value);
    this._node$.next(value);
  }
}
