import { Component } from '@angular/core';

@Component({
  selector: 'ngssm-not-found',
  template: ` <img src="/assets/404-not-found.png" /> `,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: row;
        flex: 1;
        align-items: center;
        justify-content: center;
      }
    `
  ]
})
export class NotFoundComponent {}
