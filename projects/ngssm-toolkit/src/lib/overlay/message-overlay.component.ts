import { Component } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'ngssm-message-overlay',
  template: `
    <mat-card>
      <mat-card-content>
        <mat-spinner></mat-spinner>
        {{ message$ | async }}
      </mat-card-content>
    </mat-card>
  `,
  styles: [
    `
      .mat-card-content {
        display: flex !important;
        flex-direction: column;
        align-items: flex-start;
        vertical-align: center;
      }
    `
  ]
})
export class MessageOverlayComponent {
  public message$: Observable<string> = new Subject<string>();
}
