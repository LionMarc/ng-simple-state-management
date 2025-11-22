import { Component, ChangeDetectionStrategy, signal, input, inject, effect } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { createSignal, Store } from 'ngssm-store';

import { LoadRemoteDataAction } from '../../actions';
import { selectRemoteDataState } from '../../state';
import { DataStatus } from '../../model';

const datePipe = new DatePipe('en-US');

@Component({
  selector: 'ngssm-remote-data-reload-button',
  imports: [MatIconModule, MatButtonModule, MatTooltipModule, MatProgressSpinnerModule],
  templateUrl: './ngssm-remote-data-reload-button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NgssmRemoteDataReloadButtonComponent {
  public readonly tooltipMessage = signal<string>('');
  public readonly disabled = signal<boolean>(true);
  public readonly inLoadingStatus = signal<boolean>(false);

  public actionTypes = input<string[]>([]);
  public remoteDataKeys = input<string[]>([]);

  private readonly store = inject(Store);
  private readonly remoteDataState = createSignal((state) => selectRemoteDataState(state));

  constructor() {
    effect(() => {
      const remoteDataState = this.remoteDataState();
      const keys = this.remoteDataKeys();

      this.inLoadingStatus.set(keys.findIndex((v) => remoteDataState[v]?.status === DataStatus.loading) !== -1);
      this.disabled.set(this.inLoadingStatus() === true || keys.findIndex((v) => !!remoteDataState[v]) === -1);
      let timestamp: Date | undefined;
      keys.forEach((key) => {
        const keyTimestamp = remoteDataState[key]?.timestamp;
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

  public reload(): void {
    this.remoteDataKeys().forEach((key) =>
      this.store.dispatchAction(new LoadRemoteDataAction(key, { forceReload: true, keepStoredGetterParams: true }))
    );
    this.actionTypes().forEach((type) => this.store.dispatchActionType(type));
  }
}
