import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

import { NgSsmComponent, Store } from 'ngssm-store';
import { NgssmConfirmationDialogService, NgssmNotifierService } from 'ngssm-toolkit';

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
  public readonly regexControl = new FormControl<string | null>(null);

  constructor(
    store: Store,
    private ngssmNotifierService: NgssmNotifierService,
    private ngssmConfirmationDialogService: NgssmConfirmationDialogService
  ) {
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

  public toggleRegexControlState(): void {
    if (this.regexControl.disabled) {
      this.regexControl.enable();
    } else {
      this.regexControl.disable();
    }
  }

  public displayConfirmationDialog(message: string, submitLabel: string, cancelLabel: string): void {
    console.log('displayConfirmationDialog', message, submitLabel, cancelLabel);
    this.ngssmConfirmationDialogService
      .displayConfirmationDialog({
        message,
        submitLabel,
        cancelLabel,
        submitButtonColor: 'primary',
        minWidth: 300
      })
      .subscribe((value) => {
        console.log('CONFIRMATION', value);
      });
  }
}
