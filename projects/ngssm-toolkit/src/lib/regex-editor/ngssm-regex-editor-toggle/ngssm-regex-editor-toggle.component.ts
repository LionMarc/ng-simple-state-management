import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ConnectionPositionPair, OriginConnectionPosition, OverlayConnectionPosition, OverlayModule } from '@angular/cdk/overlay';
import { MatButtonModule } from '@angular/material/button';
import { BehaviorSubject, Observable } from 'rxjs';

import { NgssmRegexEditorComponent } from '../ngssm-regex-editor/ngssm-regex-editor.component';

@Component({
    selector: 'ngssm-regex-editor-toggle',
    imports: [CommonModule, MatIconModule, MatButtonModule, OverlayModule, NgssmRegexEditorComponent],
    templateUrl: './ngssm-regex-editor-toggle.component.html',
    styleUrls: ['./ngssm-regex-editor-toggle.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NgssmRegexEditorToggleComponent {
  private readonly _isOpen$ = new BehaviorSubject<boolean>(false);
  private readonly _isDisabled$ = new BehaviorSubject<boolean>(false);
  private readonly originPos: OriginConnectionPosition = {
    originX: 'start',
    originY: 'top'
  };
  private readonly overlayPos: OverlayConnectionPosition = {
    overlayX: 'start',
    overlayY: 'top'
  };

  public readonly positions: ConnectionPositionPair[] = [new ConnectionPositionPair(this.originPos, this.overlayPos, 0, 0)];

  public regexValue: string | undefined | null;

  @Input() public inputElement: HTMLInputElement | undefined;
  @Input() set disabled(value: boolean) {
    this._isDisabled$.next(value);
  }

  public get isOpen$(): Observable<boolean> {
    return this._isOpen$.asObservable();
  }

  public get isDisabled$(): Observable<boolean> {
    return this._isDisabled$.asObservable();
  }

  public openEditor(event: MouseEvent): void {
    if (this._isDisabled$.getValue()) {
      return;
    }

    event.stopPropagation();
    this.regexValue = this.inputElement?.value;
    this._isOpen$.next(true);
  }

  public closeEditor(regex: string | undefined): void {
    this._isOpen$.next(false);
    if (regex !== undefined && this.inputElement) {
      this.inputElement.value = regex;
      this.inputElement.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }
}
