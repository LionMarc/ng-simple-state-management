import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
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
  private readonly _isReady$ = new BehaviorSubject<boolean>(false);
  private readonly markerIds: number[] = [];
  private aceEditor: any;

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

  public onEditorReady(aceEditor: any): void {
    this._isReady$.next(true);
    this.aceEditor = aceEditor;
  }

  public applyCommentPattern(): void {
    this.markerIds.forEach((id) => this.aceEditor?.getSession().removeMarker(id));
    this.markerIds.splice(0);
    const result = (window as any).ace.require('ace/range');
    const pattern = new RegExp(this.commentPatternControl.value ?? '');
    const editorContent = (this.aceEditor?.getValue() as string)?.split(/\n/);
    editorContent.forEach((l, i) => {
      if (pattern.test(l)) {
        const markerId = this.aceEditor?.getSession().addMarker(new result.Range(i, 0, i, Infinity), 'ignored-row', 'fullLine', true);
        this.markerIds.push(markerId);
      }
    });
  }
}
