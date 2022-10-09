import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';

import { NgssmAceEditorMode } from 'ngssm-ace-editor';
import { NgSsmComponent, Store } from 'ngssm-store';

@Component({
  selector: 'app-ace-editor-demo',
  templateUrl: './ace-editor-demo.component.html',
  styleUrls: ['./ace-editor-demo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AceEditorDemoComponent extends NgSsmComponent {
  private readonly _updatedContent$ = new BehaviorSubject<string>('');
  private readonly _isValid$ = new BehaviorSubject<boolean>(true);

  public readonly readonlyControl = new FormControl(true);
  public readonly modes: { label: string; value: NgssmAceEditorMode }[] = [
    { label: 'text', value: NgssmAceEditorMode.text },
    { label: 'javascript', value: NgssmAceEditorMode.javascript },
    { label: 'json', value: NgssmAceEditorMode.json },
    { label: 'python', value: NgssmAceEditorMode.python }
  ];
  public readonly modeControl = new FormControl(NgssmAceEditorMode.text);
  public readonly contentControl = new FormControl('testing initial content');

  constructor(store: Store) {
    super(store);
  }

  public get updatedContent$(): Observable<string> {
    return this._updatedContent$.asObservable();
  }

  public get isValid$(): Observable<boolean> {
    return this._isValid$.asObservable();
  }

  public onContentChanged(event: string): void {
    this._updatedContent$.next(event);
  }

  public onIsValidChanged(event: boolean): void {
    this._isValid$.next(event);
  }
}
