import { Routes } from '@angular/router';

import { NotificationsDemoComponent } from './components/notifications-demo/notifications-demo.component';

export const shellDemoRoutes: Routes = [
  {
    path: 'shell-demo',
    children: [
      {
        path: 'notifications',
        component: NotificationsDemoComponent
      }
    ]
  }
];
