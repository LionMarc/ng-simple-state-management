import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NotificationsDemoComponent } from './components/notifications-demo/notifications-demo.component';

const routes: Routes = [
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

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShellDemoRoutingModule {}
