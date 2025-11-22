
import { Component, ChangeDetectionStrategy, Injectable, Type, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';

import { Store } from 'ngssm-store';
import {
  NgssmFilePickerComponent,
  NgssmConfirmationDialogService,
  NgssmNotifierService,
  NgssmComponentDisplayDirective,
  NgssmComponentAction,
  NgssmHelpComponent
} from 'ngssm-toolkit';

import { Demo1Component } from '../demo1/demo1.component';
import { Demo2Component } from '../demo2/demo2.component';
import { ToolkitDemoActionType } from '../../actions';
import { OverlayDemoComponent } from '../overlay-demo/overlay-demo.component';

@Injectable({
  providedIn: 'root'
})
export class TestingFilePickerInitialization {
  public file?: File;
}

@Component({
  selector: 'ngssm-toolkit-demo',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatCheckboxModule,
    MatSelectModule,
    NgssmFilePickerComponent,
    NgssmComponentDisplayDirective,
    NgssmHelpComponent,
    OverlayDemoComponent
],
  templateUrl: './toolkit-demo.component.html',
  styleUrls: ['./toolkit-demo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToolkitDemoComponent {
  private readonly store = inject(Store);
  private readonly ngssmNotifierService = inject(NgssmNotifierService);
  private readonly ngssmConfirmationDialogService = inject(NgssmConfirmationDialogService);
  private readonly testingFilePickerInitialization = inject(TestingFilePickerInitialization);

  public readonly componentAction = signal<NgssmComponentAction | null>(null);

  public readonly fileControl = new FormControl<File | undefined>(undefined, Validators.required);
  public readonly displayFilePickerDetailsControl = new FormControl<boolean>(true);
  public readonly filePickerDisabledControl = new FormControl<boolean>(false);
  public readonly componentList: { label: string; component: Type<unknown> }[] = [
    { label: 'Component 1', component: Demo1Component },
    { label: 'Component 2', component: Demo2Component }
  ];
  public readonly componentDisplayControl = new FormControl<Type<unknown>>(Demo1Component);
  public readonly commentControl = new FormControl<string | null>(null);

  public readonly helpTesting = `
  <p>Using Input as help setter</p>
  `;

  constructor() {
    this.filePickerDisabledControl.valueChanges.subscribe((v) => {
      if (v) {
        this.fileControl.disable();
      } else {
        this.fileControl.enable();
      }
    });

    this.commentControl.valueChanges.subscribe((value) => {
      if (!value) {
        this.componentAction.set(null);
      } else {
        this.componentAction.set((component) => (component as Demo1Component).comment.set(value));
      }
    });

    this.fileControl.setValue(this.testingFilePickerInitialization.file);
    this.fileControl.valueChanges.subscribe((f) => {
      console.log('FileControl has changed');
      this.testingFilePickerInitialization.file = f ?? undefined;
    });
  }

  public notifyError(message: string): void {
    this.ngssmNotifierService.notifyError(message);
  }

  public notifySuccess(message: string): void {
    this.ngssmNotifierService.notifySuccess(message);
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

  public resetSelectedFileLater(): void {
    setTimeout(() => {
      console.log('CLEAR FILE SELECTION');
      this.fileControl.setValue(undefined, { emitEvent: false });
    }, 1000);
  }

  public openDialogDemo(): void {
    this.store.dispatchActionType(ToolkitDemoActionType.openDialogDemo);
  }
}
