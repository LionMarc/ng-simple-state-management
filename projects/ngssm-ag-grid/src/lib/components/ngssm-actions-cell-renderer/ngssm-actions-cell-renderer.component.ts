import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
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

  actionConfig: ActionConfig;
}

@Component({
  selector: 'ngssm-actions-cell-renderer',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './ngssm-actions-cell-renderer.component.html',
  styleUrls: ['./ngssm-actions-cell-renderer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NgssmActionsCellRendererComponent extends NgSsmComponent implements ICellRendererAngularComp {
  private readonly _actionButtons$ = new BehaviorSubject<ActionButton[]>([]);

  private cellParams: ICellRendererParams<any, any> | undefined;

  constructor(store: Store) {
    super(store);
  }

  public get actionButtons$(): Observable<ActionButton[]> {
    return this._actionButtons$.asObservable();
  }

  public agInit(params: ICellRendererParams<any, any>): void {
    this.cellParams = params;
    this.setupActions(params as any);
  }

  public refresh(params: ICellRendererParams<any, any>): boolean {
    this.cellParams = params;
    this._actionButtons$.getValue().forEach((a) => {
      if (a.actionConfig.isDisabled instanceof Function) {
        a.disabled$.next(a.actionConfig.isDisabled(params as any));
      }
    });
    return true;
  }

  public executeAction(action: ActionButton): void {
    action.actionConfig.click?.(this.cellParams as any);
  }

  private setupActions(rendererParams: NgssmActionsCellRendererParams): void {
    const actionButtons: ActionButton[] = (rendererParams?.actions ?? []).map((a) => {
      const actionButton: ActionButton = {
        cssClass: a.cssClass,
        color: a.color ?? 'primary',
        disabled$: new BehaviorSubject<boolean>(false),
        actionConfig: a
      };

      if (a.isDisabled instanceof Function) {
        actionButton.disabled$.next(a.isDisabled(rendererParams as any));
      } else if (isObservable(a.isDisabled)) {
        a.isDisabled.pipe(takeUntil(this.unsubscribeAll$)).subscribe((v) => actionButton.disabled$.next(v));
      }

      return actionButton;
    });

    this._actionButtons$.next(actionButtons);
  }
}
