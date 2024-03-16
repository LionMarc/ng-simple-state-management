import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

import { NavigationActionType } from 'ngssm-navigation';
import { NgssmCachesDisplayButtonComponent } from 'ngssm-remote-data';
import { LockNavigationBarAction, LockStatus, ShellActionType, ShellComponent, ShellConfig } from 'ngssm-shell';
import { NgSsmComponent, Store } from 'ngssm-store';

import { TodoCountComponent, TodoFooterComponent } from './todo/public-api';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, MatButtonModule, ShellComponent, NgssmCachesDisplayButtonComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent extends NgSsmComponent {
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
              component: '<div class="ngssm-chip ngssm-chip-error">Beta</div>',
              linkActiveOnlyIfExact: true
            },
            {
              label: 'Failed batches',
              icon: '<i class="fa-solid fa-bomb"></i>',
              route: '/batches/failed',
              linkActiveOnlyIfExact: false
            }
          ]
        },
        {
          label: 'Ngssm Ace Editor',
          icon: '<img src="./assets/ace-logo.png" height="20"/>',
          route: '/ace-editor'
        },
        {
          label: 'Ngssm Toolkit',
          icon: '<i class="fa-solid fa-toolbox"></i>',
          route: '/ngssm-toolkit'
        },
        {
          label: 'Shell notifications',
          icon: '<i class="fa-regular fa-message"></i>',
          route: '/shell-demo/notifications'
        },
        {
          label: 'Ngssm Tree',
          icon: '<i class="fa-solid fa-folder-tree"></i>',
          route: '/tree-demo'
        },
        {
          label: 'Ngssm Expression Tree',
          icon: '<i class="fa-solid fa-sitemap"></i>',
          route: '/expression-tree-demo'
        },
        {
          label: 'Ngssm Remote Data',
          icon: '<i class="fa-solid fa-cloud"></i>',
          route: '/remote-data-demo'
        },
        {
          label: 'Ngssm Visibility',
          icon: '<i class="fa-solid fa-eye-slash"></i>',
          route: '/visibility-demo'
        },
        {
          label: 'Ngssm Data',
          icon: '<i class="fa-solid fa-cloud"></i>',
          route: '/ngssm-data'
        }
      ]
    },
    displayFooter: true,
    footerComponents: this.footerComponents,
    displayFooterNotificationsButton: true
  };

  public readonly lockStatus = LockStatus;

  constructor(store: Store) {
    super(store);
  }

  public closeNavigationBar(): void {
    this.dispatchActionType(ShellActionType.closeNavigationBar);
  }

  public openNavigationBar(): void {
    this.dispatchActionType(ShellActionType.openNavigationBar);
  }

  public lockNavigationBar(status: LockStatus): void {
    this.dispatchAction(new LockNavigationBarAction(status));
  }

  public lockNavigation(isLocked: boolean): void {
    if (isLocked) {
      this.dispatchActionType(NavigationActionType.lockNavigation);
    } else {
      this.dispatchActionType(NavigationActionType.unLockNavigation);
    }
  }
}
