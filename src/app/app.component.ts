import { Component } from '@angular/core';

import { NavigationSection } from 'ngssm-toolkit';

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
    }
  ];
}
