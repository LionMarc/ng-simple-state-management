import { Component, ChangeDetectionStrategy, Input, ElementRef, Output, EventEmitter, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, Observable, Subject, combineLatest, take } from 'rxjs';

import { NgSsmComponent, Store } from 'ngssm-store';
import { NgssmComponentAction, NgssmComponentDisplayDirective } from 'ngssm-toolkit';

import { NgssmExpressionTreeConfig, NgssmExpressionTreeCustomComponent } from '../../model';

@Component({
  selector: 'ngssm-expression-tree-node-details',
  imports: [CommonModule, NgssmComponentDisplayDirective],
  templateUrl: './ngssm-expression-tree-node-details.component.html',
  styleUrls: ['./ngssm-expression-tree-node-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NgssmExpressionTreeNodeDetailsComponent extends NgSsmComponent {
  private readonly _nodeId$ = new Subject<string>();
  private readonly _treeConfig$ = new Subject<NgssmExpressionTreeConfig>();
  private readonly _componentAction$ = new BehaviorSubject<NgssmComponentAction | undefined>(undefined);
  private readonly _componentToDisplay$ = new BehaviorSubject<Type<unknown> | undefined>(undefined);

  private initialized = false;

  @Output() public heightChanged: EventEmitter<number> = new EventEmitter<number>();

  constructor(
    store: Store,
    private elementRef: ElementRef
  ) {
    super(store);

    combineLatest([this._nodeId$, this._treeConfig$])
      .pipe(take(1))
      .subscribe((values) => {
        this.initialized = true;

        this._componentAction$.next((c: unknown) => (c as NgssmExpressionTreeCustomComponent).setup(values[1].treeId, values[0]));
        this._componentToDisplay$.next(values[1].nodeDetailComponent);
        setTimeout(() => {
          this.heightChanged.emit(this.elementRef?.nativeElement.getBoundingClientRect().height ?? 0);
        });
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

  public get componentToDisplay$(): Observable<Type<unknown> | undefined> {
    return this._componentToDisplay$.asObservable();
  }
}
