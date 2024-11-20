import { Component, ChangeDetectionStrategy, Input, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BehaviorSubject, combineLatest, takeUntil } from 'rxjs';

import { NgSsmComponent, Store } from 'ngssm-store';

import { LoadRemoteDataAction } from '../../actions';
import { selectRemoteDataState } from '../../state';
import { DataStatus } from '../../model';

const datePipe = new DatePipe('en-US');

@Component({
    selector: 'ngssm-remote-data-reload-button',
    imports: [CommonModule, MatIconModule, MatButtonModule, MatTooltipModule, MatProgressSpinnerModule],
    templateUrl: './ngssm-remote-data-reload-button.component.html',
    styleUrls: ['./ngssm-remote-data-reload-button.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NgssmRemoteDataReloadButtonComponent extends NgSsmComponent {
  private readonly _remoteDataKeys$ = new BehaviorSubject<string[]>([]);

  public readonly tooltipMessage = signal<string>('');
  public readonly disabled = signal<boolean>(true);
  public readonly inLoadingStatus = signal<boolean>(false);

  @Input() actionTypes: string[] = [];

  constructor(store: Store) {
    super(store);

    combineLatest([this.watch((s) => selectRemoteDataState(s)), this._remoteDataKeys$.pipe(takeUntil(this.unsubscribeAll$))])
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe((values) => {
        this.inLoadingStatus.set(values[1].findIndex((v) => values[0][v]?.status === DataStatus.loading) !== -1);
        this.disabled.set(this.inLoadingStatus() === true || values[1].findIndex((v) => !!values[0][v]) === -1);
        let timestamp: Date | undefined;
        values[1].forEach((key) => {
          const keyTimestamp = values[0][key]?.timestamp;
          if (keyTimestamp) {
            if (!timestamp || timestamp.getTime() > keyTimestamp.getTime()) {
              timestamp = keyTimestamp;
            }
          }
        });

        let tooltiMessage = 'Reload data.';
        if (timestamp) {
          tooltiMessage = [tooltiMessage, `Loaded at ${datePipe.transform(timestamp, 'mediumTime')}`].join('\n');
        }
        this.tooltipMessage.set(tooltiMessage);
      });
  }

  @Input() set remoteDataKeys(value: string[]) {
    this._remoteDataKeys$.next(value);
  }

  public reload(): void {
    this._remoteDataKeys$
      .getValue()
      .forEach((key) => this.dispatchAction(new LoadRemoteDataAction(key, { forceReload: true, keepStoredGetterParams: true })));
    (this.actionTypes ?? []).forEach((type) => this.dispatchActionType(type));
  }
}
