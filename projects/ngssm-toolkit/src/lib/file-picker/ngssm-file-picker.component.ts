import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostBinding, Input, OnDestroy, Optional, Self, ViewChild } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { MatFormFieldControl } from '@angular/material/form-field';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { NgssmFileSizePipe } from './ngssm-file-size.pipe';

export const noop = () => {};

@Component({
  selector: 'ngssm-file-picker',
  standalone: true,
  imports: [CommonModule, NgssmFileSizePipe],
  templateUrl: './ngssm-file-picker.component.html',
  styleUrls: ['./ngssm-file-picker.component.scss'],
  providers: [{ provide: MatFormFieldControl, useExisting: NgssmFilePickerComponent }]
})
export class NgssmFilePickerComponent implements MatFormFieldControl<File>, ControlValueAccessor, OnDestroy {
  private static nextId = 0;

  private readonly _displayDetails$ = new BehaviorSubject<boolean>(true);

  private onChangeCallback: (_: any) => void = noop;
  private _required = false;
  private _disabled = false;

  @ViewChild('fileInput', { static: true }) fileInput: ElementRef | undefined;

  constructor(@Optional() @Self() public ngControl: NgControl) {
    // Replace the provider from above with this.
    if (this.ngControl != null) {
      // Setting the value accessor directly (instead of using
      // the providers) to avoid running into a circular import.
      this.ngControl.valueAccessor = this;
    }
  }

  @HostBinding('id') public id = `file-picker-${NgssmFilePickerComponent.nextId++}`;
  public controlType = 'file-picker';
  public placeholder: string = '';
  public focused: boolean = false;
  public stateChanges = new Subject<void>();
  public value: File | null = null;
  public autofilled?: boolean | undefined;
  public userAriaDescribedBy?: string | undefined;

  public get empty(): boolean {
    return this.value === null;
  }

  public get shouldLabelFloat(): boolean {
    return this.value !== null;
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

  public get errorState(): boolean {
    return this.ngControl.invalid ?? false;
  }

  public get lastModificationDate(): string {
    if (this.value) {
      const date = new Date(this.value.lastModified);
      return date.toISOString();
    }

    return '';
  }

  public get displayDetails$(): Observable<boolean> {
    return this._displayDetails$.asObservable();
  }

  @Input()
  public set displayDetails(value: boolean) {
    this._displayDetails$.next(value);
  }

  public setDescribedByIds(ids: string[]): void {}

  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  public onContainerClick(event: MouseEvent): void {
    if (!this.disabled) {
      this.fileInput?.nativeElement.click();
    }
  }

  public writeValue(obj: File | null | undefined): void {
    this.value = obj ?? null;
    if (!this.value && this.fileInput) {
      this.fileInput.nativeElement.value = null;
    }
  }

  public registerOnChange(fn: any): void {
    this.onChangeCallback = fn;
  }

  public registerOnTouched(fn: any): void {}

  public ngOnDestroy(): void {
    this.stateChanges.complete();
  }

  public onDrop(event: any): void {
    this.preventAndStop(event);
    if (!this.disabled) {
      this.updateValue(event.dataTransfer.files);
    }
  }

  public onDragOver(event: any): void {
    this.preventAndStop(event);
  }

  public onDragLeave(event: any): void {
    this.preventAndStop(event);
  }

  public onFileSelected(): void {
    this.updateValue(this.fileInput?.nativeElement.files);
  }

  private preventAndStop(event: any): void {
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
