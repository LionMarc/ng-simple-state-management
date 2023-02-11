import { Component, ChangeDetectionStrategy, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormControl, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';

import { useDefaultErrorStateMatcher } from '../../default-error-state-matcher';

export const regexValidator = (control: AbstractControl): ValidationErrors | null => {
  try {
    const regex = new RegExp(control.value);
    if (regex.test('')) {
      // nothing here
    }
  } catch (error: any) {
    return {
      regex: error.message
    };
  }

  return null;
};

@Component({
  selector: 'ngssm-regex-editor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  providers: [useDefaultErrorStateMatcher],
  templateUrl: './ngssm-regex-editor.component.html',
  styleUrls: ['./ngssm-regex-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NgssmRegexEditorComponent {
  private readonly _isRegexValid$ = new BehaviorSubject<boolean | null>(null);

  public readonly regexControl = new FormControl<string | null>(null, [Validators.required, regexValidator]);
  public readonly testStringControl = new FormControl<string>('');

  @Output() closeEditor = new EventEmitter<string | undefined>();

  constructor() {
    combineLatest([this.regexControl.valueChanges, this.testStringControl.valueChanges, this.regexControl.statusChanges]).subscribe(
      (values) => {
        if (this.regexControl.invalid || (values[1] ?? '').length === 0) {
          this._isRegexValid$.next(null);
          return;
        }

        this._isRegexValid$.next(new RegExp(values[0] ?? '').test(values[1] ?? ''));
      }
    );
  }

  @Input() set regex(value: string | undefined | null) {
    this.regexControl.setValue(value ?? null);
  }

  public get isRegexValid$(): Observable<boolean | null> {
    return this._isRegexValid$.asObservable();
  }

  public cancel(): void {
    this.closeEditor.emit();
  }

  public submit(): void {
    this.closeEditor.emit(this.regexControl.value ?? '');
  }
}
