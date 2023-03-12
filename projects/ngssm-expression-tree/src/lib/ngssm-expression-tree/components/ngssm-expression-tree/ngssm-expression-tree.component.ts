import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { BehaviorSubject, Observable, Subscription, takeUntil } from 'rxjs';

import { NgSsmComponent, Store } from 'ngssm-store';

import { NgssmExpressionTree, NgssmExpressionTreeConfig, NgssmExpressionTreeNode } from '../../model';
import { selectNgssmExpressionTreeState } from '../../state';

@Component({
  selector: 'ngssm-expression-tree',
  standalone: true,
  imports: [CommonModule, ScrollingModule, MatCardModule, MatDividerModule],
  templateUrl: './ngssm-expression-tree.component.html',
  styleUrls: ['./ngssm-expression-tree.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NgssmExpressionTreeComponent extends NgSsmComponent {
  private readonly _tree$ = new BehaviorSubject<NgssmExpressionTree | undefined>(undefined);
  private readonly _displayedNodes$ = new BehaviorSubject<NgssmExpressionTreeNode[]>([]);
  private readonly _treeConfig$ = new BehaviorSubject<NgssmExpressionTreeConfig | undefined>(undefined);

  private _treeSubscription?: Subscription;

  constructor(store: Store) {
    super(store);

    this._tree$.pipe(takeUntil(this.unsubscribeAll$)).subscribe((tree) => {
      this._displayedNodes$.next(tree?.nodes ?? []);
    });
  }

  @Input() public set treeConfig(value: NgssmExpressionTreeConfig | null | undefined) {
    this._treeSubscription?.unsubscribe();
    if (!value) {
      this._treeConfig$.next(undefined);
      return;
    }

    const config: NgssmExpressionTreeConfig = {
      ...value
    };
    if (!value.getNodeLabel) {
      value.getNodeLabel = (node) => node.data.id;
    }
    this._treeConfig$.next(config);
    this._treeSubscription = this.watch((s) => selectNgssmExpressionTreeState(s).trees[value.treeId]).subscribe((tree) =>
      this._tree$.next(tree)
    );
  }

  public get treeConfig$(): Observable<NgssmExpressionTreeConfig | undefined> {
    return this._treeConfig$.asObservable();
  }

  public get displayedNodes$(): Observable<NgssmExpressionTreeNode[]> {
    return this._displayedNodes$.asObservable();
  }

  public getItemId(_: number, node: NgssmExpressionTreeNode): string {
    return node.data.id;
  }

  public getDefaultPadding(): number {
    return this._treeConfig$.getValue()?.nodePadding ?? 20;
  }
}
