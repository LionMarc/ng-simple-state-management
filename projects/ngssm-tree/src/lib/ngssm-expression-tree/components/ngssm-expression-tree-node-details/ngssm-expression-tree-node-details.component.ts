import { Component, ChangeDetectionStrategy, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, Observable, Subject, combineLatest, take, takeUntil } from 'rxjs';

import { NgSsmComponent, Store } from 'ngssm-store';
import { NgssmComponentAction, NgssmComponentDisplayDirective } from 'ngssm-toolkit';

import { NgssmExpressionTreeConfig, NgssmExpressionTreeDescriptionComponent } from '../../model';
import { selectNgssmExpressionTreeState } from '../../state';

@Component({
  selector: 'ngssm-expression-tree-node-details',
  standalone: true,
  imports: [CommonModule, NgssmComponentDisplayDirective],
  templateUrl: './ngssm-expression-tree-node-details.component.html',
  styleUrls: ['./ngssm-expression-tree-node-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NgssmExpressionTreeNodeDetailsComponent extends NgSsmComponent {
  private readonly _nodeId$ = new Subject<string>();
  private readonly _treeConfig$ = new Subject<NgssmExpressionTreeConfig>();
  private readonly _componentAction$ = new BehaviorSubject<NgssmComponentAction | undefined>(undefined);
  private readonly _componentToDisplay$ = new BehaviorSubject<any>(undefined);
  private readonly _nodeData$ = new BehaviorSubject<any>(undefined);

  private initialized = false;

  @Output() public heightChanged: EventEmitter<number> = new EventEmitter<number>();

  constructor(store: Store, private elementRef: ElementRef) {
    super(store);

    combineLatest([this._nodeId$, this._treeConfig$])
      .pipe(take(1))
      .subscribe((values) => {
        this.initialized = true;
        this.listenToData(values[1].treeId, values[0]);
        this.listenToNodeData(values[1], values[0]);
      });
  }

  @Input() public set nodeId(value: string | null | undefined) {
    if (!value) {
      return;
    }

    if (this.initialized) {
      throw new Error('Component NgssmExpressionTreeNodeDetailsComponent is already initialized.');
    }

    this._nodeId$.next(value);
  }

  @Input() public set treeConfig(value: NgssmExpressionTreeConfig | null | undefined) {
    if (!value) {
      return;
    }

    if (this.initialized) {
      throw new Error('Component NgssmExpressionTreeNodeDetailsComponent is already initialized.');
    }

    this._treeConfig$.next(value);
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
          this._componentAction$.next((c: NgssmExpressionTreeDescriptionComponent) => c.setNode(node, values[0]));
          this._componentToDisplay$.next(treeConfig.getNodeDetailComponent?.(node, values[0]));
          setTimeout(() => {
            this.heightChanged.emit(this.elementRef?.nativeElement.getBoundingClientRect().height ?? 0);
          });
        }
      });
  }
}
