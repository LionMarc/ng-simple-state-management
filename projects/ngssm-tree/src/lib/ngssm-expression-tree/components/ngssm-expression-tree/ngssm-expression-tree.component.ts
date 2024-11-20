import { Component, ChangeDetectionStrategy, Input, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { BehaviorSubject, Observable, Subscription, takeUntil } from 'rxjs';

import { NgSsmComponent, Store } from 'ngssm-store';

import { NgssmExpressionTree, NgssmExpressionTreeConfig, NgssmExpressionTreeNode } from '../../model';
import { selectNgssmExpressionTreeState } from '../../state';
import { NgssmCollapseExpressionTreeNodeAction, NgssmExpandExpressionTreeNodeAction } from '../../actions';
import { NgssmExpressionTreeNodeComponent } from '../ngssm-expression-tree-node/ngssm-expression-tree-node.component';
import { NgssmExpressionTreeNodeDetailsComponent } from '../ngssm-expression-tree-node-details/ngssm-expression-tree-node-details.component';

@Component({
    selector: 'ngssm-expression-tree',
    imports: [
        CommonModule,
        ScrollingModule,
        MatCardModule,
        MatDividerModule,
        MatIconModule,
        NgssmExpressionTreeNodeComponent,
        NgssmExpressionTreeNodeDetailsComponent
    ],
    templateUrl: './ngssm-expression-tree.component.html',
    styleUrls: ['./ngssm-expression-tree.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NgssmExpressionTreeComponent extends NgSsmComponent {
  private readonly _tree$ = new BehaviorSubject<NgssmExpressionTree | undefined>(undefined);
  private readonly _displayedNodes$ = new BehaviorSubject<NgssmExpressionTreeNode[]>([]);
  private readonly _treeConfig$ = new BehaviorSubject<NgssmExpressionTreeConfig | undefined>(undefined);

  private _treeSubscription?: Subscription;

  constructor(
    store: Store,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    super(store);

    this._tree$.pipe(takeUntil(this.unsubscribeAll$)).subscribe((tree) => {
      const displayedNodes: NgssmExpressionTreeNode[] = [];
      const collapsedNodes = new Set<string>();
      (tree?.nodes ?? []).forEach((node) => {
        if (node.data.isExpandable === true && node.isExpanded === false) {
          collapsedNodes.add(node.data.id);
        }

        if (!node.data.parentId || node.path.findIndex((p) => collapsedNodes.has(p)) === -1) {
          displayedNodes.push(node);
        }
      });

      this._displayedNodes$.next(displayedNodes);
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
    if (!config.getNodeLabel) {
      config.getNodeLabel = (node) => node.data.id;
    }

    if (!config.expandIconClass) {
      config.expandIconClass = 'fa-solid fa-chevron-right';
    }

    if (!config.collapseIconClass) {
      config.collapseIconClass = 'fa-solid fa-chevron-down';
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

  public expand(node: NgssmExpressionTreeNode): void {
    const treeId = this._treeConfig$.getValue()?.treeId;
    if (treeId) {
      this.dispatchAction(new NgssmExpandExpressionTreeNodeAction(treeId, node.data.id));
    }
  }

  public collapse(node: NgssmExpressionTreeNode): void {
    const treeId = this._treeConfig$.getValue()?.treeId;
    if (treeId) {
      this.dispatchAction(new NgssmCollapseExpressionTreeNodeAction(treeId, node.data.id));
    }
  }

  public forceRefresh(): void {
    this.changeDetectorRef.markForCheck();
  }
}
