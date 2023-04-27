import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { BehaviorSubject, Observable, combineLatest, filter, switchMap, takeUntil } from 'rxjs';

import { NgSsmComponent, Store } from 'ngssm-store';
import { NgssmComponentAction, NgssmComponentDisplayDirective } from 'ngssm-toolkit';

import { NgssmExpressionTreeConfig, NgssmExpressionTreeCustomComponent } from '../../model';
import { selectNgssmExpressionTreeState } from '../../state';

@Component({
  selector: 'ngssm-expression-tree-node',
  standalone: true,
  imports: [CommonModule, MatIconModule, NgssmComponentDisplayDirective],
  templateUrl: './ngssm-expression-tree-node.component.html',
  styleUrls: ['./ngssm-expression-tree-node.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NgssmExpressionTreeNodeComponent extends NgSsmComponent {
  private readonly _nodeId$ = new BehaviorSubject<string | undefined>(undefined);
  private readonly _treeConfig$ = new BehaviorSubject<NgssmExpressionTreeConfig | undefined>(undefined);
  private readonly _nodeLabel$ = new BehaviorSubject<string>('');
  private readonly _nodeCssIcon$ = new BehaviorSubject<string | undefined>(undefined);
  private readonly _nodeDescription$ = new BehaviorSubject<string | undefined>(undefined);
  private readonly _componentAction$ = new BehaviorSubject<NgssmComponentAction | undefined>(undefined);
  private readonly _componentToDisplay$ = new BehaviorSubject<any>(undefined);

  constructor(store: Store) {
    super(store);

    combineLatest([this._nodeId$, this._treeConfig$])
      .pipe(
        filter((v) => v[0] !== undefined && v[1] !== undefined),
        takeUntil(this.unsubscribeAll$),
        switchMap((v) =>
          combineLatest([
            this.watch((s) => selectNgssmExpressionTreeState(s).trees[v[1]?.treeId ?? 'unknown'].data[v[0] ?? 'unknown']),
            this.watch((s) => selectNgssmExpressionTreeState(s).trees[v[1]?.treeId ?? 'unknown'].nodes)
          ])
        ),
        takeUntil(this.unsubscribeAll$)
      )
      .subscribe((values) => {
        const node = values[1].find((v) => v.data.id === this._nodeId$.getValue());
        const treeConfig = this._treeConfig$.getValue();
        const nodeValue = values[0];
        if (node && treeConfig && nodeValue) {
          this._nodeLabel$.next(treeConfig.getNodeLabel?.(node, nodeValue) ?? '');
          this._nodeCssIcon$.next(treeConfig.getNodeCssIcon?.(node, nodeValue) ?? undefined);
          this._nodeDescription$.next(treeConfig.getNodeDescription?.(node, nodeValue));
        }
      });

    combineLatest([this._nodeId$, this._treeConfig$])
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe((values) => {
        const treeConfig = values[1];
        const nodeId = values[0];
        if (treeConfig && nodeId) {
          this._componentAction$.next((c: NgssmExpressionTreeCustomComponent) => c.setup(treeConfig.treeId, nodeId));
          this._componentToDisplay$.next(treeConfig.nodeDescriptionComponent);
        }
      });
  }

  @Input() public set nodeId(value: string | null | undefined) {
    if (!value) {
      return;
    }

    this._nodeId$.next(value);
  }

  @Input() public set treeConfig(value: NgssmExpressionTreeConfig | null | undefined) {
    if (!value) {
      return;
    }

    this._treeConfig$.next(value);
  }

  public get nodeLabel$(): Observable<string> {
    return this._nodeLabel$.asObservable();
  }

  public get nodeCssIcon$(): Observable<string | undefined> {
    return this._nodeCssIcon$.asObservable();
  }

  public get nodeDescription$(): Observable<string | undefined> {
    return this._nodeDescription$.asObservable();
  }

  public get componentAction$(): Observable<NgssmComponentAction | undefined> {
    return this._componentAction$.asObservable();
  }

  public get componentToDisplay$(): Observable<any> {
    return this._componentToDisplay$.asObservable();
  }
}
