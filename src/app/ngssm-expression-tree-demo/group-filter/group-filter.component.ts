import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BehaviorSubject, Observable } from 'rxjs';

import { NgSsmComponent, Store } from 'ngssm-store';
import { NgssmExpressionTreeDescriptionComponent, NgssmExpressionTreeNode } from 'ngssm-tree';

import { Filter } from '../filter';

@Component({
  selector: 'app-group-filter',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './group-filter.component.html',
  styleUrls: ['./group-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GroupFilterComponent extends NgSsmComponent implements NgssmExpressionTreeDescriptionComponent<Filter> {
  private readonly _nodeId$ = new BehaviorSubject<string>('');

  constructor(store: Store) {
    super(store);
    console.log('GroupFilterComponent - constructor');
  }

  public get nodeId$(): Observable<string> {
    return this._nodeId$.asObservable();
  }

  public setNode(value: NgssmExpressionTreeNode<Filter>): void {
    console.log('GroupFilterComponent', value, value.data.id, this._nodeId$.getValue());
    this._nodeId$.next(value.data.id);
  }
}
