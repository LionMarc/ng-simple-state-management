import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

import { NgSsmComponent, Store } from 'ngssm-store';

import { getNgssmDataSourceValueAutoReloadTypes, NgssmDataSourceValueAutoReloadType } from '../../model';

@Component({
  selector: 'ngssm-auto-reload',
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatSelectModule],
  templateUrl: './ngssm-auto-reload.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NgssmAutoReloadComponent extends NgSsmComponent {
  private timerId: number | undefined;

  public readonly reloadTypes = getNgssmDataSourceValueAutoReloadTypes();
  public readonly reloadTypeControl = new FormControl<NgssmDataSourceValueAutoReloadType>('Off');

  @Input() autoReloadAction: () => void = () => {
    // nothing by default
  };

  constructor(store: Store) {
    super(store);

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

      this.timerId = setInterval(this.autoReloadAction, period) as unknown as number;
    });

    this.unsubscribeAll$.subscribe(() => {
      if (this.timerId) {
        clearInterval(this.timerId);
        this.timerId = undefined;
      }
    });
  }
}
