import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { NgSsmComponent, Store } from 'ngssm-store';
import {
  NgssmFilePickerComponent,
  NgssmConfirmationDialogService,
  NgssmNotifierService,
  NgssmRegexEditorToggleComponent,
  NgssmComponentDisplayDirective,
  NgssmComponentAction
} from 'ngssm-toolkit';
import { OverlayDemoComponent } from '../overlay-demo/overlay-demo.component';
import { Demo1Component } from '../demo1/demo1.component';
import { Demo2Component } from '../demo2/demo2.component';
import { BehaviorSubject, Observable } from 'rxjs';

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
    MatSelectModule,
    NgssmFilePickerComponent,
    NgssmRegexEditorToggleComponent,
    OverlayDemoComponent,
    NgssmComponentDisplayDirective,
    Demo1Component,
    Demo2Component
  ],
  templateUrl: './toolkit-demo.component.html',
  styleUrls: ['./toolkit-demo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToolkitDemoComponent extends NgSsmComponent {
  private readonly _componentAction$ = new BehaviorSubject<NgssmComponentAction | null>(null);

  public readonly fileControl = new FormControl<File | undefined>(undefined, Validators.required);
  public readonly displayFilePickerDetailsControl = new FormControl<boolean>(true);
  public readonly filePickerDisabledControl = new FormControl<boolean>(false);
  public readonly regexControl = new FormControl<string | null>(null);
  public readonly componentList: { label: string; component: any }[] = [
    { label: 'Component 1', component: Demo1Component },
    { label: 'Component 2', component: Demo2Component }
  ];
  public readonly componentDisplayControl = new FormControl<any>(Demo1Component);
  public readonly commentControl = new FormControl<string | null>(null);

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

    this.commentControl.valueChanges.subscribe((value) => {
      if (!value) {
        this._componentAction$.next(null);
      } else {
        this._componentAction$.next((component) => component.setComment(value));
      }
    });
  }

  public get componentAction$(): Observable<NgssmComponentAction | null> {
    return this._componentAction$.asObservable();
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
