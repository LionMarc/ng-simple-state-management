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
import { NgssmAutoReloadComponent } from '../ngssm-auto-reload/ngssm-auto-reload.component';

@Component({
  selector: 'ngssm-data-reload-button',
  imports: [CommonModule, MatButtonModule, MatTooltipModule, MatIconModule, MatProgressSpinnerModule, NgssmAutoReloadComponent],
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
  public readonly icon = signal<string>('fa-solid fa-rotate-right');
  public readonly color = signal<string>('primary');
  public readonly withAutoReload = signal<boolean>(false);
  public readonly reloadAction = () => this.reload();
  public readonly buttonLabel = signal<string | undefined>(undefined);

  @Input() public keepAdditionalProperties = false;

  constructor(store: Store) {
    super(store);
  }

  @Input() set buttonIcon(value: string) {
    this.icon.set(value);
  }

  @Input() set autoReloadEnabled(value: boolean) {
    this.withAutoReload.set(value);
  }

  @Input() public set dataSourceKeys(value: string[]) {
    this.toUnsubscribe$.next();
    this._dataSourceKeys = value ?? [];
    this.watch((s) => selectNgssmDataState(s).dataSourceValues)
      .pipe(takeUntil(this.toUnsubscribe$))
      .subscribe((values) => {
        this.loadInProgress.set(this._dataSourceKeys.findIndex((v) => values[v]?.status === NgssmDataSourceValueStatus.loading) !== -1);
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

        if (this.loadInProgress()) {
          this.buttonDisabled.set(true);
          return;
        }

        const someHasAnInvalidParameter = this._dataSourceKeys.findIndex((key) => values[key]?.parameterIsValid === false) !== -1;
        if (someHasAnInvalidParameter) {
          this.buttonDisabled.set(true);
          return;
        }

        this.buttonDisabled.set(this._dataSourceKeys.findIndex((v) => !!values[v]) === -1);

        const someHasAnOutdatedValue = this._dataSourceKeys.findIndex((key) => values[key]?.valueOutdated === true) !== -1;
        this.color.set(someHasAnOutdatedValue ? 'accent' : 'primary');
      });
  }

  @Input() public set label(value: string | undefined) {
    this.buttonLabel.set(value);
  }

  public reload(): void {
    const isDisabled = this.buttonDisabled();
    if (isDisabled) {
      return;
    }

    this._dataSourceKeys.forEach((key) =>
      this.dispatchAction(
        new NgssmLoadDataSourceValueAction(key, { forceReload: true, keepAdditionalProperties: this.keepAdditionalProperties })
      )
    );
  }
}
