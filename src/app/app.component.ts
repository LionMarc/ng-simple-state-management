import { Component } from '@angular/core';

import { ConsoleAppender, NavigationSection } from 'ngssm-toolkit';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public readonly navigationSections: NavigationSection[] = [
    {
      iconClass: 'fa-solid fa-house',
      label: 'Home',
      route: '/home',
      items: []
    },
    {
      iconClass: 'fa-solid fa-clipboard-list',
      label: 'ToDo',
      route: '/todo',
      items: []
    }
  ];

  constructor(consoleAppender: ConsoleAppender) {
    consoleAppender.start();
  }
}
