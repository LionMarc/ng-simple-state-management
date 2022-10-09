import { AfterViewInit, Component, ElementRef, EventEmitter, Input, NgZone, OnDestroy, Output, ViewChild } from '@angular/core';
import { take } from 'rxjs';

import { AceBuildsLoader } from '../ace-builds-loader';
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
  @Output() contentChanged = new EventEmitter<string>();
  @Output() isValidChanged = new EventEmitter<boolean>();

  public aceEditor: any;

  constructor(private aceBuildsLoader: AceBuildsLoader, private zone: NgZone) {}

  @Input() public set content(value: string) {
    if (this.aceEditor) {
      this.silentContentUpdate = true;
      this.aceEditor.setValue(value, -1);
      this.silentContentUpdate = false;
    } else {
      this.initialContent = value;
    }
  }

  @Input() public set readonly(value: boolean) {
    if (this.aceEditor) {
      this.aceEditor.setReadOnly(value);
    } else {
      this.initialReadonly = value;
    }
  }

  @Input() public set editorMode(value: string) {
    if (this.aceEditor) {
      this.aceEditor.session.setMode(value);
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
          this.aceEditor = ace.edit(this.aceEditorDiv?.nativeElement);
          if (this.aceEditor) {
            this.aceEditor.$blockScrolling = Infinity;
            this.aceEditor.setTheme('ace/theme/github');
            this.aceEditor.session.setMode(this.initialEditorMode);
            this.aceEditor.setReadOnly(this.initialReadonly);
            this.aceEditor.setValue(this.initialContent, -1);

            this.aceEditor.on('change', () => {
              if (!this.silentContentUpdate) {
                this.zone.run(() => this.contentChanged.emit(this.aceEditor.getValue()));
              }
            });
            this.aceEditor.getSession().on('changeAnnotation', () => {
              const annotations: any[] = this.aceEditor.getSession().getAnnotations();
              const isValid = annotations.findIndex((annotation) => annotation.type === 'error') === -1;
              this.zone.run(() => this.isValidChanged.emit(isValid));
            });
          }
        });
      });
  }

  public ngOnDestroy(): void {
    this.aceEditor?.destroy();
  }
}
