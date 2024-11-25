import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { BehaviorSubject, Observable } from 'rxjs';

import { NgssmAceEditorApi, NgssmAceEditorComponent, NgssmAceEditorMode } from 'ngssm-ace-editor';
import { NgSsmComponent, Store } from 'ngssm-store';

@Component({
  selector: 'app-ace-editor-demo',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatSelectModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    NgssmAceEditorComponent
  ],
  templateUrl: './ace-editor-demo.component.html',
  styleUrls: ['./ace-editor-demo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AceEditorDemoComponent extends NgSsmComponent {
  private readonly _updatedContent$ = new BehaviorSubject<string>('');
  private readonly _isValid$ = new BehaviorSubject<boolean>(true);
  private readonly _isReady$ = new BehaviorSubject<boolean>(false);
  private aceEditorApi: NgssmAceEditorApi | undefined;

  public readonly readonlyControl = new FormControl(true);
  public readonly modes: { label: string; value: NgssmAceEditorMode }[] = [
    { label: 'text', value: NgssmAceEditorMode.text },
    { label: 'javascript', value: NgssmAceEditorMode.javascript },
    { label: 'json', value: NgssmAceEditorMode.json },
    { label: 'python', value: NgssmAceEditorMode.python }
  ];
  public readonly modeControl = new FormControl(NgssmAceEditorMode.text);
  public readonly contentControl = new FormControl('testing initial content');
  public readonly commentPatternControl = new FormControl(undefined, Validators.required);

  constructor(store: Store) {
    super(store);
  }

  public get updatedContent$(): Observable<string> {
    return this._updatedContent$.asObservable();
  }

  public get isValid$(): Observable<boolean> {
    return this._isValid$.asObservable();
  }

  public get isReady$(): Observable<boolean> {
    return this._isReady$.asObservable();
  }

  public onContentChanged(event: string): void {
    this._updatedContent$.next(event);
  }

  public onIsValidChanged(event: boolean): void {
    this._isValid$.next(event);
  }

  public onEditorReady(aceEditorApi: NgssmAceEditorApi): void {
    this._isReady$.next(true);
    this.aceEditorApi = aceEditorApi;
  }

  public applyCommentPattern(): void {
    this.aceEditorApi?.clearAllRowsMarkers();
    const pattern = new RegExp(this.commentPatternControl.value ?? '');
    const editorContent = (this.aceEditorApi?.aceEditor?.getValue() as string)?.split(/\r?\n/);
    editorContent.forEach((l, i) => {
      if (pattern.test(l)) {
        this.aceEditorApi?.addRowsMarker(i, i, 'ignored-row');
      }
    });
  }
}
