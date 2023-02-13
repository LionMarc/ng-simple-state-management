import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BehaviorSubject, combineLatest, Observable, takeUntil } from 'rxjs';

import { NgSsmComponent, Store } from 'ngssm-store';
import { DataStatus } from 'ngssm-remote-data';

import { NgssmTreeConfig, NgssmTreeNode, NodeData } from '../../model';
import { selectNgssmTreeState } from '../../state';
import { CollapseNodeAction, ExpandNodeAction, SelectNodeAction } from '../../actions';

@Component({
  selector: 'ngssm-tree',
  standalone: true,
  imports: [CommonModule, ScrollingModule, MatCardModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './ngssm-tree.component.html',
  styleUrls: ['./ngssm-tree.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NgssmTreeComponent extends NgSsmComponent {
  private readonly _treeConfig$ = new BehaviorSubject<NgssmTreeConfig | undefined>(undefined);
  private readonly _displayedItems$ = new BehaviorSubject<NgssmTreeNode[]>([]);
  private readonly _selectedNodeId$ = new BehaviorSubject<string | undefined>(undefined);

  public readonly dataStatus = DataStatus;

  constructor(store: Store) {
    super(store);

    // TODO - start watching when treeConfig is set
    combineLatest([this._treeConfig$, this.watch((s) => selectNgssmTreeState(s).trees)])
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe((values) => {
        if (!values[0]) {
          this._displayedItems$.next([]);
          return;
        }

        const alwaysTrue = (_: NodeData) => true;
        const filter: (node: NodeData) => boolean = values[0].filter ?? alwaysTrue;

        const items: NgssmTreeNode[] = [];
        let hiddenLevel = -1;
        (values[1][values[0].treeId]?.nodes ?? []).forEach((t) => {
          if (t.node.isExpandable && t.isExpanded === false && hiddenLevel === -1) {
            hiddenLevel = t.level;
          }

          if (hiddenLevel === -1 || t.level <= hiddenLevel) {
            if (filter(t.node)) {
              items.push(t);
            }
          }

          if (t.node.isExpandable && t.level <= hiddenLevel) {
            hiddenLevel = t.isExpanded === true ? -1 : t.level;
          }
        });

        this._displayedItems$.next(items);

        this._selectedNodeId$.next(values[1][values[0].treeId]?.selectedNode);
      });
  }

  @Input() set treeConfig(value: NgssmTreeConfig | undefined | null) {
    if (value) {
      this._treeConfig$.next(value);
    }
  }

  public get treeConfig$(): Observable<NgssmTreeConfig | undefined> {
    return this._treeConfig$.asObservable();
  }

  public get displayedItems$(): Observable<NgssmTreeNode[]> {
    return this._displayedItems$.asObservable();
  }

  public get selectedNodeId$(): Observable<string | undefined> {
    return this._selectedNodeId$.asObservable();
  }

  public getItemId(_: number, node: NgssmTreeNode): string {
    return node.node.nodeId;
  }

  public expand(node: NgssmTreeNode): void {
    const treeId = this._treeConfig$.getValue()?.treeId;
    if (treeId) {
      this.dispatchAction(new ExpandNodeAction(treeId, node.node.nodeId));
    }
  }

  public collapse(node: NgssmTreeNode): void {
    const treeId = this._treeConfig$.getValue()?.treeId;
    if (treeId) {
      this.dispatchAction(new CollapseNodeAction(treeId, node.node.nodeId));
    }
  }

  public selectNode(node: NgssmTreeNode): void {
    const treeId = this._treeConfig$.getValue()?.treeId;
    if (treeId) {
      this.dispatchAction(new SelectNodeAction(treeId, node.node.nodeId));
    }
  }
}
