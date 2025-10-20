import { Component, ChangeDetectionStrategy, signal, input, effect, inject } from '@angular/core';
import { NgClass } from '@angular/common';
import { MatTooltip } from '@angular/material/tooltip';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

import { DateTime } from 'luxon';

import { createSignal, Store } from 'ngssm-store';

import { selectNgssmDataState } from '../../state';
import { isNgssmDataSourceValueParameterValid, NgssmDataSourceValue, NgssmDataSourceValueStatus } from '../../model';
import { NgssmLoadDataSourceValueAction } from '../../actions';
import { NgssmAutoReloadComponent } from '../ngssm-auto-reload/ngssm-auto-reload.component';

@Component({
  selector: 'ngssm-data-reload-button',
  imports: [NgClass, MatButton, MatIconButton, MatTooltip, MatIcon, MatProgressSpinner, NgssmAutoReloadComponent],
  templateUrl: './ngssm-data-reload-button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NgssmDataReloadButtonComponent {
  private readonly store = inject(Store);

  private readonly dataSourceValues = createSignal<Record<string, NgssmDataSourceValue>>(
    (state) => selectNgssmDataState(state).dataSourceValues
  );

  public readonly loadInProgress = signal<boolean>(false);
  public readonly buttonDisabled = signal<boolean>(true);
  public readonly tooltipMessage = signal<string>('');
  public readonly color = signal<string>('primary');
  public readonly reloadAction = () => this.reload();

  public label = input<string | undefined>(undefined);
  public keepAdditionalProperties = input(false);
  public buttonIcon = input<string>('fa-solid fa-rotate-right');
  public autoReloadEnabled = input(false);
  public dataSourceKeys = input<string[]>([]);

  constructor() {
    effect(() => {
      const values = this.dataSourceValues();
      const keys = this.dataSourceKeys();
      this.loadInProgress.set(keys.findIndex((v) => values[v]?.status === NgssmDataSourceValueStatus.loading) !== -1);
      let timestamp: DateTime | undefined;
      keys.forEach((key) => {
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

      const someHasAnInvalidParameter =
        keys.findIndex((key) => values[key] && isNgssmDataSourceValueParameterValid(values[key]) === false) !== -1;
      if (someHasAnInvalidParameter) {
        this.buttonDisabled.set(true);
        return;
      }

      this.buttonDisabled.set(keys.findIndex((v) => !!values[v]) === -1);

      const someHasAnOutdatedValue = keys.findIndex((key) => values[key]?.valueOutdated === true) !== -1;
      this.color.set(someHasAnOutdatedValue ? 'accent' : 'primary');
    });
  }

  public reload(): void {
    const isDisabled = this.buttonDisabled();
    if (isDisabled) {
      return;
    }

    this.dataSourceKeys().forEach((key) =>
      this.store.dispatchAction(
        new NgssmLoadDataSourceValueAction(key, { forceReload: true, keepAdditionalProperties: this.keepAdditionalProperties() })
      )
    );
  }
}
