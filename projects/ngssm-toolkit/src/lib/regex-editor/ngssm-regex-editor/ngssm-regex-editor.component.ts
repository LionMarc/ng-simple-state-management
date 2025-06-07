import { Component, ChangeDetectionStrategy, EventEmitter, Output, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormControl, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { A11yModule } from '@angular/cdk/a11y';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';

import { useDefaultErrorStateMatcher } from '../../default-error-state-matcher';
import { defaultRegexEditorValidator, NGSSM_REGEX_EDITOR_VALIDATOR, RegexEditorValidator } from '../regex-editor-validator';

@Component({
  selector: 'ngssm-regex-editor',
  imports: [
    CommonModule,
    A11yModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  providers: [useDefaultErrorStateMatcher],
  templateUrl: './ngssm-regex-editor.component.html',
  styleUrls: ['./ngssm-regex-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NgssmRegexEditorComponent {
  private readonly validator: RegexEditorValidator | null = inject(NGSSM_REGEX_EDITOR_VALIDATOR, { optional: true });

  private readonly regexValidator: RegexEditorValidator;
  private readonly _isRegexValid$ = new BehaviorSubject<boolean | null>(null);

  public readonly regexControl: FormControl<string | null>;
  public readonly testStringControl = new FormControl<string>('');

  @Output() closeEditor = new EventEmitter<string | undefined>();

  constructor() {
    this.regexValidator = this.validator ?? defaultRegexEditorValidator;
    this.regexControl = new FormControl<string | null>(null, [Validators.required, (c) => this.validatedRegex(c)]);
    combineLatest([this.regexControl.valueChanges, this.testStringControl.valueChanges, this.regexControl.statusChanges]).subscribe(
      (values) => {
        if (this.regexControl.invalid || (values[1] ?? '').length === 0) {
          this._isRegexValid$.next(null);
          return;
        }

        const isMatch = this.regexValidator.isMatch(values[0] ?? '', values[1] ?? '');
        this._isRegexValid$.next(isMatch);
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

  private validatedRegex(control: AbstractControl): ValidationErrors | null {
    const result = this.regexValidator.validatePattern(control.value);
    if (result.isValid) {
      return null;
    }

    return {
      regex: result.error
    };
  }
}
