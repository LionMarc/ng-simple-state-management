import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MaterialImportsModule } from 'ngssm-toolkit';
import { NgssmAceEditorComponent } from 'ngssm-ace-editor';

import { ShellComponent } from './components/shell/shell.component';
import { SideNavComponent } from './components/side-nav/side-nav.component';
import { WrapperComponent } from './components/wrapper/wrapper.component';
import { navigationBarReducerProvider } from './reducers/navigation-bar.reducer';
import { ShellNotificationsComponent } from './components/shell-notifications/shell-notifications.component';
import { shellNotificationsReducerProvider } from './reducers/shell-notifications.reducer';
import { notificationShowingEffectProvider } from './effects/notification-showing.effect';
import { ShellNotificationPopupComponent } from './components/shell-notification-popup/shell-notification-popup.component';
import { ShellNotificationComponent } from './components/shell-notification/shell-notification.component';

@NgModule({
  declarations: [
    ShellComponent,
    SideNavComponent,
    WrapperComponent,
    ShellNotificationsComponent,
    ShellNotificationPopupComponent,
    ShellNotificationComponent
  ],
  imports: [RouterModule, MaterialImportsModule, NgssmAceEditorComponent],
  exports: [ShellComponent, SideNavComponent],
  providers: []
})
export class NgssmShellModule {
  static forRoot(): ModuleWithProviders<NgssmShellModule> {
    return {
      ngModule: NgssmShellModule,
      providers: [navigationBarReducerProvider, shellNotificationsReducerProvider, notificationShowingEffectProvider]
    };
  }
}
