import { Component, ChangeDetectionStrategy, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BehaviorSubject, isObservable, Observable, takeUntil } from 'rxjs';

import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

import { NgSsmComponent, Store } from 'ngssm-store';

import { NgssmActionsCellRendererParams } from './ngssm-actions-cell-renderer-params';
import { ActionConfig } from './action-config';

interface ActionButton {
  cssClass: string;
  color: string;
  disabled$: BehaviorSubject<boolean>;
  hidden$: BehaviorSubject<boolean>;

  actionConfig: ActionConfig;

  tooltip: string;
}

@Component({
  selector: 'ngssm-actions-cell-renderer',
  imports: [CommonModule, MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './ngssm-actions-cell-renderer.component.html',
  styleUrls: ['./ngssm-actions-cell-renderer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NgssmActionsCellRendererComponent extends NgSsmComponent implements ICellRendererAngularComp {
  private readonly _actionButtons$ = new BehaviorSubject<ActionButton[]>([]);

  private cellParams: ICellRendererParams | undefined;

  constructor(
    store: Store,
    private ngZone: NgZone
  ) {
    super(store);
  }

  public get actionButtons$(): Observable<ActionButton[]> {
    return this._actionButtons$.asObservable();
  }

  public agInit(params: ICellRendererParams): void {
    this.cellParams = params;
    this.setupActions(params as unknown as NgssmActionsCellRendererParams);
  }

  public refresh(params: ICellRendererParams): boolean {
    this.cellParams = params;
    this._actionButtons$.getValue().forEach((a) => {
      if (a.actionConfig.isDisabled instanceof Function) {
        a.disabled$.next(a.actionConfig.isDisabled(params));
      }

      if (a.actionConfig.isHidden instanceof Function) {
        a.hidden$.next(a.actionConfig.isHidden(params));
      }
    });
    return true;
  }

  public executeAction(action: ActionButton): void {
    const params = this.cellParams;
    if (params) {
      this.ngZone.run(() => action.actionConfig.click?.(params));
    }
  }

  private setupActions(rendererParams: NgssmActionsCellRendererParams): void {
    const actionButtons: ActionButton[] = (rendererParams?.actions ?? []).map((a) => {
      const actionButton: ActionButton = {
        cssClass: a.cssClass,
        color: a.color ?? 'primary',
        disabled$: new BehaviorSubject<boolean>(false),
        hidden$: new BehaviorSubject<boolean>(false),
        actionConfig: a,
        tooltip: a.tooltip ?? ''
      };

      if (a.isDisabled instanceof Function) {
        actionButton.disabled$.next(a.isDisabled(rendererParams as unknown as ICellRendererParams));
      } else if (isObservable(a.isDisabled)) {
        a.isDisabled.pipe(takeUntil(this.unsubscribeAll$)).subscribe((v) => actionButton.disabled$.next(v));
      }

      if (a.isHidden instanceof Function) {
        actionButton.hidden$.next(a.isHidden(rendererParams as unknown as ICellRendererParams));
      } else if (isObservable(a.isHidden)) {
        a.isHidden.pipe(takeUntil(this.unsubscribeAll$)).subscribe((v) => actionButton.hidden$.next(v));
      }

      return actionButton;
    });

    this._actionButtons$.next(actionButtons);
  }
}
