import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { NgSsmComponent, Store } from 'ngssm-store';
import { FilePickerComponent, NgssmConfirmationDialogService, NgssmNotifierService, NgssmRegexEditorToggleComponent } from 'ngssm-toolkit';
import { OverlayDemoComponent } from '../overlay-demo/overlay-demo.component';

@Component({
  selector: 'app-toolkit-demo',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatCheckboxModule,
    FilePickerComponent,
    NgssmRegexEditorToggleComponent,
    OverlayDemoComponent
  ],
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
