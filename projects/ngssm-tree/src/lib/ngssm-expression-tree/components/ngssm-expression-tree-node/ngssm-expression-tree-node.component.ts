import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { BehaviorSubject, Observable, Subject, combineLatest, take, takeUntil } from 'rxjs';

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
  private readonly _nodeId$ = new Subject<string>();
  private readonly _treeConfig$ = new Subject<NgssmExpressionTreeConfig>();
  private readonly _nodeLabel$ = new BehaviorSubject<string>('');
  private readonly _nodeCssIcon$ = new BehaviorSubject<string | undefined>(undefined);
  private readonly _nodeDescription$ = new BehaviorSubject<string | undefined>(undefined);
  private readonly _nodeData$ = new BehaviorSubject<any>(undefined);
  private readonly _componentAction$ = new BehaviorSubject<NgssmComponentAction | undefined>(undefined);
  private readonly _componentToDisplay$ = new BehaviorSubject<any>(undefined);

  private initialized = false;

  constructor(store: Store) {
    super(store);

    combineLatest([this._nodeId$, this._treeConfig$])
      .pipe(take(1))
      .subscribe((values) => {
        this.initialized = true;
        this.listenToData(values[1].treeId, values[0]);
        this.listenToNodeData(values[1], values[0]);

        this._componentAction$.next((c: NgssmExpressionTreeCustomComponent) => c.setup(values[1].treeId, values[0]));
        this._componentToDisplay$.next(values[1].nodeDescriptionComponent);
      });
  }

  @Input() public set nodeId(value: string | null | undefined) {
    if (!value) {
      return;
    }

    if (this.initialized) {
      throw new Error('Component NgssmExpressionTreeNodeComponent is already initialized.');
    }

    this._nodeId$.next(value);
  }

  @Input() public set treeConfig(value: NgssmExpressionTreeConfig | null | undefined) {
    if (!value) {
      return;
    }

    if (this.initialized) {
      throw new Error('Component NgssmExpressionTreeNodeComponent is already initialized.');
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

  private listenToData(treeId: string, nodeId: string): void {
    this.watch((s) => selectNgssmExpressionTreeState(s).trees[treeId].data[nodeId]).subscribe((data) => {
      this._nodeData$.next(data);
    });
  }

  private listenToNodeData(treeConfig: NgssmExpressionTreeConfig, nodeId: string): void {
    combineLatest([this._nodeData$, this.watch((s) => selectNgssmExpressionTreeState(s).trees[treeConfig.treeId].nodes)])
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe((values) => {
        const node = values[1].find((v) => v.data.id === nodeId);
        if (node) {
          this._nodeLabel$.next(treeConfig.getNodeLabel?.(node, values[0]) ?? '');
          this._nodeCssIcon$.next(treeConfig.getNodeCssIcon?.(node, values[0]) ?? undefined);
          this._nodeDescription$.next(treeConfig.getNodeDescription?.(node, values[0]));
        }
      });
  }
}
