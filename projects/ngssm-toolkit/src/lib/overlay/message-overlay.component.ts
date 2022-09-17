import { Component } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'ngssm-message-overlay',
  template: `
    <mat-card>
      <mat-card-content fxLayout="column" fxLayoutAlign="center center">
        <mat-spinner></mat-spinner>
        {{ message$ | async }}
      </mat-card-content>
    </mat-card>
  `,
  styles: []
})
export class MessageOverlayComponent {
  public message$: Observable<string> = new Subject<string>();
}
