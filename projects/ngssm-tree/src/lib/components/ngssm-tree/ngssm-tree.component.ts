import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';

import { NgSsmComponent, Store } from 'ngssm-store';
import { DataStatus } from 'ngssm-remote-data';

import { NgssmTree, NgssmTreeConfig, NgssmTreeNode, NodeData } from '../../model';
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

  private treeSubscription: Subscription | undefined;

  public readonly dataStatus = DataStatus;

  constructor(store: Store) {
    super(store);
  }

  @Input() set treeConfig(value: NgssmTreeConfig | undefined | null) {
    if (value) {
      this._treeConfig$.next({ ...value });

      this.treeSubscription?.unsubscribe();
      this.treeSubscription = this.watch((s) => selectNgssmTreeState(s).trees[value.treeId]).subscribe((tree: NgssmTree | undefined) => {
        const config = this._treeConfig$.getValue();
        if (!tree || !config) {
          this._displayedItems$.next([]);
          return;
        }

        const alwaysTrue = (_: NodeData) => true;
        const filter: (node: NodeData) => boolean = config.filter ?? alwaysTrue;

        const items: NgssmTreeNode[] = [];
        let hiddenLevel = -1;
        const nodesToFindSelected = new Map<string, { isDisplayed: boolean; node: NgssmTreeNode }>();
        (tree.nodes ?? []).forEach((t) => {
          if (t.node.isExpandable && t.isExpanded === false && hiddenLevel === -1) {
            hiddenLevel = t.level;
          }

          if (hiddenLevel === -1 || t.level <= hiddenLevel) {
            if (filter(t.node)) {
              items.push(t);
              nodesToFindSelected.set(t.node.nodeId, { isDisplayed: true, node: t });
            }
          }

          if (t.node.isExpandable && t.level <= hiddenLevel) {
            hiddenLevel = t.isExpanded === true ? -1 : t.level;
          }

          if (!nodesToFindSelected.has(t.node.nodeId)) {
            nodesToFindSelected.set(t.node.nodeId, { isDisplayed: false, node: t });
          }
        });

        this._displayedItems$.next(items);

        let selectedNode = tree.selectedNode;
        if (!selectedNode) {
          this._selectedNodeId$.next(undefined);
        } else {
          while (selectedNode) {
            const item = nodesToFindSelected.get(selectedNode);
            if (item?.isDisplayed !== true) {
              selectedNode = item?.node.node.parentNodeId;
            } else {
              break;
            }
          }

          this._selectedNodeId$.next(selectedNode);
        }
      });
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
