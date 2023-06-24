import { Component, ChangeDetectionStrategy, Input, Signal, computed, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';

import { NgSsmComponent, Store } from 'ngssm-store';

import { LoadRemoteDataAction } from '../../actions';
import { selectRemoteData, selectRemoteDataState } from '../../state';
import { DataStatus } from '../../model';

const datePipe = new DatePipe('en-US');

@Component({
  selector: 'ngssm-remote-data-reload-button',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatTooltipModule, MatProgressSpinnerModule],
  templateUrl: './ngssm-remote-data-reload-button.component.html',
  styleUrls: ['./ngssm-remote-data-reload-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NgssmRemoteDataReloadButtonComponent extends NgSsmComponent {
  private readonly _remoteDataKey$ = new BehaviorSubject<string>('');
  private readonly _tooltipMessage$ = new BehaviorSubject<string>('');
  private readonly _disabled$ = new BehaviorSubject<boolean>(false);

  public readonly inLoadingStatus: Signal<boolean>;
  public readonly remoteDataKeySignal = signal<string>('');

  @Input() actionTypes: string[] = [];

  constructor(store: Store) {
    super(store);

    this.inLoadingStatus = computed(() => {
      const status = selectRemoteData(this.store.state(), this.remoteDataKeySignal());
      return status?.status === DataStatus.loading;
    });

    combineLatest([this.watch((s) => selectRemoteDataState(s)), this._remoteDataKey$]).subscribe((values) => {
      let tooltiMessage = 'Reload data.';
      let disabled = true;
      if (values[1]) {
        const timestamp = values[0][values[1]]?.timestamp;
        if (timestamp) {
          tooltiMessage = [tooltiMessage, `Loaded at ${datePipe.transform(timestamp, 'mediumTime')}`].join('\n');
        }

        disabled = (values[0][values[1]]?.status ?? DataStatus.loading) === DataStatus.loading;
      }

      this._tooltipMessage$.next(tooltiMessage);
      this._disabled$.next(disabled);
    });
  }

  @Input() set remoteDataKey(value: string) {
    this._remoteDataKey$.next(value);
    this.remoteDataKeySignal.set(value);
  }

  public get tooltipMessage$(): Observable<string> {
    return this._tooltipMessage$.asObservable();
  }

  public get disabled$(): Observable<boolean> {
    return this._disabled$.asObservable();
  }

  public reload(): void {
    this.dispatchAction(new LoadRemoteDataAction(this._remoteDataKey$.getValue(), { forceReload: true, keepStoredGetterParams: true }));

    (this.actionTypes ?? []).forEach((type) => this.dispatchActionType(type));
  }
}
