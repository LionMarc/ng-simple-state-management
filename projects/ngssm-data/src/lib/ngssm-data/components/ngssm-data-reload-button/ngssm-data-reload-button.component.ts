import { Component, ChangeDetectionStrategy, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Subject, takeUntil } from 'rxjs';

import { DateTime } from 'luxon';

import { NgSsmComponent, Store } from 'ngssm-store';

import { selectNgssmDataState } from '../../state';
import { NgssmDataSourceValueStatus } from '../../model';
import { NgssmLoadDataSourceValueAction } from '../../actions';

@Component({
  selector: 'ngssm-data-reload-button',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatTooltipModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './ngssm-data-reload-button.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NgssmDataReloadButtonComponent extends NgSsmComponent {
  private readonly toUnsubscribe$ = new Subject<void>();
  private _dataSourceKeys: string[] = [];

  public readonly loadInProgress = signal<boolean>(false);
  public readonly buttonDisabled = signal<boolean>(true);
  public readonly tooltipMessage = signal<string>('');

  constructor(store: Store) {
    super(store);
  }

  @Input() public set dataSourceKeys(value: string[]) {
    this.toUnsubscribe$.next();
    this._dataSourceKeys = value ?? [];
    this.watch((s) => selectNgssmDataState(s).dataSourceValues)
      .pipe(takeUntil(this.toUnsubscribe$))
      .subscribe((values) => {
        this.loadInProgress.set(this._dataSourceKeys.findIndex((v) => values[v]?.status === NgssmDataSourceValueStatus.loading) !== -1);
        this.buttonDisabled.set(this.loadInProgress() === true || this._dataSourceKeys.findIndex((v) => !!values[v]) === -1);
        let timestamp: DateTime | undefined;
        this._dataSourceKeys.forEach((key) => {
          const keyTimestamp = values[key]?.lastLoadingDate;
          if (keyTimestamp) {
            if (!timestamp || timestamp > keyTimestamp) {
              timestamp = keyTimestamp;
            }
          }
        });

        let tooltiMessage = 'Reload data.';
        if (timestamp) {
          tooltiMessage = [tooltiMessage, `Loaded at ${timestamp.toHTTP()}`].join('\n');
        }
        this.tooltipMessage.set(tooltiMessage);
      });
  }

  public reload(): void {
    this._dataSourceKeys.forEach((key) => this.dispatchAction(new NgssmLoadDataSourceValueAction(key, true)));
  }
}
