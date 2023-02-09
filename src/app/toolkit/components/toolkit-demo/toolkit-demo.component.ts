import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

import { NgSsmComponent, Store } from 'ngssm-store';
import { NgssmNotifierService } from 'ngssm-toolkit';

@Component({
  selector: 'app-toolkit-demo',
  templateUrl: './toolkit-demo.component.html',
  styleUrls: ['./toolkit-demo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToolkitDemoComponent extends NgSsmComponent {
  public readonly fileControl = new FormControl<File | undefined>(undefined, Validators.required);
  public readonly displayFilePickerDetailsControl = new FormControl<boolean>(true);
  public readonly filePickerDisabledControl = new FormControl<boolean>(false);

  constructor(store: Store, private ngssmNotifierService: NgssmNotifierService) {
    super(store);

    this.filePickerDisabledControl.valueChanges.subscribe((v) => {
      if (v) {
        this.fileControl.disable();
      } else {
        this.fileControl.enable();
      }
    });
  }

  public notifyError(message: string): void {
    this.ngssmNotifierService.notifyError(message);
  }

  public notifySuccess(message: string): void {
    this.ngssmNotifierService.notifySuccess(message);
  }
}
