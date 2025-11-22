import { Component, Type, inject } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';

import { NavigationActionType } from 'ngssm-navigation';
import { NgssmCachesDisplayButtonComponent } from 'ngssm-remote-data';
import { LockNavigationBarAction, LockStatus, ShellActionType, ShellComponent, ShellConfig } from 'ngssm-shell';
import { createSignal, Store } from 'ngssm-store';
import { selectNgssmDataSourceValue } from 'ngssm-data';
import { ServiceInfo, serviceInfoKey } from 'ngssm-smusdi';

import { TodoCountComponent, TodoFooterComponent } from './todo/public-api';

@Component({
  selector: 'ngssm-root',
  imports: [MatButtonModule, ShellComponent, NgssmCachesDisplayButtonComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  private readonly store = inject(Store);

  private readonly footerComponents: (string | Type<unknown>)[] = [
    '<div class="footer-message">Demo application</div>',
    '<div class="footer-message">Another message</div>',
    '<div class="footer-message">And another one</div>',
    TodoFooterComponent
  ];

  public readonly serviceInfo = createSignal<ServiceInfo | undefined>(
    (s) => selectNgssmDataSourceValue<ServiceInfo>(s, serviceInfoKey)?.value
  );

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
          label: 'Ngssm Feature State',
          icon: '<i class="fa-solid fa-store"></i>',
          route: '/ngssm-feature-state'
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

  public closeNavigationBar(): void {
    this.store.dispatchActionType(ShellActionType.closeNavigationBar);
  }

  public openNavigationBar(): void {
    this.store.dispatchActionType(ShellActionType.openNavigationBar);
  }

  public lockNavigationBar(status: LockStatus): void {
    this.store.dispatchAction(new LockNavigationBarAction(status));
  }

  public lockNavigation(isLocked: boolean): void {
    if (isLocked) {
      this.store.dispatchActionType(NavigationActionType.lockNavigation);
    } else {
      this.store.dispatchActionType(NavigationActionType.unLockNavigation);
    }
  }
}
