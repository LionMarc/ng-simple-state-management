/* eslint-disable @typescript-eslint/member-ordering */
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostBinding, inject, input, Input, OnDestroy, ViewChild } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { MatFormFieldControl } from '@angular/material/form-field';
import { Subject } from 'rxjs';

import { NgssmFileSizePipe } from './ngssm-file-size.pipe';

export const noop = () => {
  // nothing to do
};

@Component({
  selector: 'ngssm-file-picker',
  imports: [CommonModule, NgssmFileSizePipe],
  templateUrl: './ngssm-file-picker.component.html',
  styleUrls: ['./ngssm-file-picker.component.scss'],
  providers: [{ provide: MatFormFieldControl, useExisting: NgssmFilePickerComponent }]
})
export class NgssmFilePickerComponent implements MatFormFieldControl<File>, ControlValueAccessor, OnDestroy {
  private static nextId = 0;

  @ViewChild('fileInput', { static: true }) fileInput: ElementRef | undefined;
  @HostBinding('id') public id = `file-picker-${NgssmFilePickerComponent.nextId++}`;

  public readonly ngControl: NgControl | null = inject(NgControl, { optional: true, self: true });

  public readonly displayDetails = input(true);

  public controlType = 'file-picker';
  public placeholder = '';
  public focused = false;
  public stateChanges = new Subject<void>();
  public value: File | null = null;
  public autofilled?: boolean | undefined;
  public userAriaDescribedBy?: string | undefined;

  private onChangeCallback: (_: unknown) => void = noop;
  private _required = false;
  private _disabled = false;

  constructor() {
    // Replace the provider from above with this.
    if (this.ngControl != null) {
      // Setting the value accessor directly (instead of using
      // the providers) to avoid running into a circular import.
      this.ngControl.valueAccessor = this;
    }
  }

  @Input()
  public get required(): boolean {
    return this._required;
  }

  public set required(value: boolean) {
    this._required = coerceBooleanProperty(value);
    this.stateChanges.next();
  }

  @Input()
  public get disabled(): boolean {
    return this._disabled;
  }

  public set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
    this.stateChanges.next();
  }

  public get empty(): boolean {
    return this.value === null;
  }

  public get shouldLabelFloat(): boolean {
    return this.value !== null;
  }

  public get errorState(): boolean {
    return this.ngControl?.invalid ?? false;
  }

  public get lastModificationDate(): string {
    if (this.value) {
      const date = new Date(this.value.lastModified);
      return date.toISOString();
    }

    return '';
  }

  public setDescribedByIds(): void {
    // nothing to do
  }

  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  public onContainerClick(): void {
    if (!this.disabled) {
      this.fileInput?.nativeElement.click();
    }
  }

  public writeValue(obj: File | null | undefined): void {
    this.value = obj ?? null;
    if (!this.value && this.fileInput) {
      this.fileInput.nativeElement.value = null;
    }

    this.stateChanges.next();
  }

  public registerOnChange(fn: (_: unknown) => void): void {
    this.onChangeCallback = fn;
  }

  public registerOnTouched(): void {
    // nothing to do
  }

  public ngOnDestroy(): void {
    this.stateChanges.complete();
  }

  public onDrop(event: DragEvent): void {
    this.preventAndStop(event);
    if (!this.disabled && event.dataTransfer !== null) {
      this.updateValue(event.dataTransfer.files);
    }
  }

  public onDragOver(event: DragEvent): void {
    this.preventAndStop(event);
  }

  public onDragLeave(event: DragEvent): void {
    this.preventAndStop(event);
  }

  public onFileSelected(): void {
    this.updateValue(this.fileInput?.nativeElement.files);
  }

  private preventAndStop(event: DragEvent): void {
    event.stopPropagation();
    event.preventDefault();
  }

  private updateValue(files: FileList): void {
    if (files.length > 0) {
      this.value = files[0];
      this.stateChanges.next();
      this.onChangeCallback(this.value);
    }
  }
}
