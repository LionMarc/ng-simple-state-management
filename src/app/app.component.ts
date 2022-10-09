import { Component } from '@angular/core';

import { ShellConfig } from 'ngssm-shell';
import { ConsoleAppender } from 'ngssm-toolkit';

import { TodoCountComponent, TodoFooterComponent } from './todo/public-api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  private readonly footerComponents: any[] = [
    '<div class="footer-message">Demo application</div>',
    '<div class="footer-message">Another message</div>',
    '<div class="footer-message">And another one</div>',
    TodoFooterComponent
  ];

  public readonly shellConfig: ShellConfig = {
    logo: './assets/logo.png',
    applicationTitle: 'Demo Application',
    sidenavConfig: {
      title: 'Demo Menu',
      sections: [
        {
          label: 'Home',
          icon: '<i class="fa-solid fa-house"></i>',
          route: '/home'
        },
        {
          label: 'To-Do List',
          icon: '<i class="fa-solid fa-clipboard-list"></i>',
          route: '/todo-list',
          component: TodoCountComponent
        },
        {
          label: 'Batches',
          icon: '<i class="fa-regular fa-clock"></i>',
          route: '/batches',
          items: [
            {
              label: 'Create batch',
              icon: '<i class="fa-solid fa-plus"></i>',
              route: '/batches/create',
              component: '<div class="ngssm-chip ngssm-chip-info">NEW</div>'
            },
            {
              label: 'Running batches',
              icon: '<i class="fas fa-spinner fa-spin"></i>',
              route: '/batches/running',
              component: '<div class="ngssm-chip ngssm-chip-error">Beta</div>'
            },
            {
              label: 'Failed batches',
              icon: '<i class="fa-solid fa-bomb"></i>',
              route: '/batches/failed'
            }
          ]
        },
        {
          label: 'Ngssm Ace Editor',
          icon: '<img src="./assets/ace-logo.png" height="20"/>',
          route: '/ace-editor'
        }
      ]
    },
    displayFooter: true,
    footerComponents: this.footerComponents
  };

  constructor(consoleAppender: ConsoleAppender) {
    consoleAppender.start();
  }
}
