import { Component, ChangeDetectionStrategy, input, OnDestroy } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatFormField, MatLabel } from '@angular/material/form-field';

import { getNgssmDataSourceValueAutoReloadTypes, NgssmDataSourceValueAutoReloadType } from '../../model';

@Component({
  selector: 'ngssm-auto-reload',
  imports: [ReactiveFormsModule, MatFormField, MatLabel, MatSelect, MatOption],
  templateUrl: './ngssm-auto-reload.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NgssmAutoReloadComponent implements OnDestroy {
  private timerId: number | undefined;

  public readonly autoReloadAction = input<() => void>(() => {
    // nothing by default
  });

  public readonly reloadTypes = getNgssmDataSourceValueAutoReloadTypes();
  public readonly reloadTypeControl = new FormControl<NgssmDataSourceValueAutoReloadType>('Off');

  constructor() {
    this.reloadTypeControl.valueChanges.subscribe((v) => {
      if (v === 'Off' && this.timerId) {
        clearInterval(this.timerId);
        this.timerId = undefined;
        return;
      }

      let period = 60000;
      switch (v) {
        case '5min':
          period = 5 * period;
          break;

        case '15min':
          period = 15 * period;
          break;
      }

      this.timerId = setInterval(this.autoReloadAction(), period) as unknown as number;
    });
  }

  public ngOnDestroy(): void {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = undefined;
    }
  }
}
