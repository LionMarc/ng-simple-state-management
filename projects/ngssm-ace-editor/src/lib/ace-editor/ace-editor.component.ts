import { AfterViewInit, Component, ElementRef, EventEmitter, Input, NgZone, OnDestroy, Output, ViewChild } from '@angular/core';
import { take } from 'rxjs';

import { AceBuildsLoader } from '../ace-builds-loader';
import { NgssmAceEditorApi } from '../ngssm-ace-editor-api';
import { NgssmAceEditorMode } from '../ngssm-ace-editor-mode';

@Component({
  selector: 'ngssm-ace-editor',
  templateUrl: './ace-editor.component.html',
  styleUrls: ['./ace-editor.component.scss']
})
export class AceEditorComponent implements AfterViewInit, OnDestroy {
  private initialContent = '';
  private initialReadonly = true;
  private initialEditorMode: string = NgssmAceEditorMode.text;
  private silentContentUpdate = false;

  @ViewChild('aceEditor') public aceEditorDiv: ElementRef | undefined;
  @Output() public contentChanged = new EventEmitter<string>();
  @Output() public isValidChanged = new EventEmitter<boolean>();
  @Output() public editorReady = new EventEmitter<NgssmAceEditorApi>();

  public api: NgssmAceEditorApi | undefined;

  constructor(private aceBuildsLoader: AceBuildsLoader, private zone: NgZone) {}

  @Input() public set content(value: string) {
    if (this.api?.aceEditor) {
      this.silentContentUpdate = true;
      this.api.aceEditor.setValue(value, -1);
      this.silentContentUpdate = false;
    } else {
      this.initialContent = value;
    }
  }

  @Input() public set readonly(value: boolean) {
    if (this.api?.aceEditor) {
      this.api.aceEditor.setReadOnly(value);
    } else {
      this.initialReadonly = value;
    }
  }

  @Input() public set editorMode(value: string) {
    if (this.api?.aceEditor) {
      this.api.aceEditor.session.setMode(value);
    } else {
      this.initialEditorMode = value;
    }
  }

  public ngAfterViewInit(): void {
    this.aceBuildsLoader
      .loadScripts()
      .pipe(take(1))
      .subscribe(() => {
        this.zone.runOutsideAngular(() => {
          const ace: any = (window as any).ace;
          const aceEditor = ace.edit(this.aceEditorDiv?.nativeElement);
          if (aceEditor) {
            this.api = new NgssmAceEditorApi(aceEditor);
            this.api.aceEditor.$blockScrolling = Infinity;
            this.api.aceEditor.setTheme('ace/theme/github');
            this.api.aceEditor.session.setMode(this.initialEditorMode);
            this.api.aceEditor.setReadOnly(this.initialReadonly);
            this.api.aceEditor.setValue(this.initialContent, -1);

            this.api.aceEditor.on('change', () => {
              if (!this.silentContentUpdate) {
                this.zone.run(() => this.contentChanged.emit(this.api?.aceEditor.getValue()));
              }
            });
            this.api.aceEditor.getSession().on('changeAnnotation', () => {
              const annotations: any[] = this.api?.aceEditor.getSession().getAnnotations();
              const isValid = annotations.findIndex((annotation) => annotation.type === 'error') === -1;
              this.zone.run(() => this.isValidChanged.emit(isValid));
            });

            this.editorReady.emit(this.api);
          }
        });
      });
  }

  public ngOnDestroy(): void {
    this.api?.aceEditor?.destroy();
  }
}
