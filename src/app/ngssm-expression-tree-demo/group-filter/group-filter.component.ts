import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BehaviorSubject, Observable } from 'rxjs';

import { NgSsmComponent, Store } from 'ngssm-store';
import { NgssmExpressionTreeCustomComponent, selectNgssmExpressionTreeState } from 'ngssm-tree';

import { Filter, FilterType } from '../filter';

@Component({
  selector: 'app-group-filter',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './group-filter.component.html',
  styleUrls: ['./group-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GroupFilterComponent extends NgSsmComponent implements NgssmExpressionTreeCustomComponent<Filter> {
  private readonly _nodeId$ = new BehaviorSubject<string>('');
  private readonly _mustBeDisplayed$ = new BehaviorSubject<boolean>(false);

  constructor(store: Store) {
    super(store);
    console.log('GroupFilterComponent - constructor');
  }

  public get nodeId$(): Observable<string> {
    return this._nodeId$.asObservable();
  }

  public get mustBeDisplayed$(): Observable<boolean> {
    return this._mustBeDisplayed$.asObservable();
  }

  public setup(treeId: string, nodeId: string): void {
    console.log('GroupFilterComponent', treeId, nodeId, this._nodeId$.getValue());
    this._nodeId$.next(nodeId);
    this.watch((s) => selectNgssmExpressionTreeState(s).trees[treeId].data[nodeId]).subscribe((v: Filter) =>
      this._mustBeDisplayed$.next(v.type === FilterType.and || v.type === FilterType.or)
    );
  }
}
