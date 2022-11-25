import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

import { NgSsmComponent, Store } from 'ngssm-store';

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

  constructor(store: Store) {
    super(store);

    this.filePickerDisabledControl.valueChanges.subscribe((v) => {
      if (v) {
        this.fileControl.disable();
      } else {
        this.fileControl.enable();
      }
    });
  }
}
