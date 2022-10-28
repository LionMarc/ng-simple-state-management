import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MaterialImportsModule } from 'ngssm-toolkit';

import { ShellComponent } from './components/shell/shell.component';
import { SideNavComponent } from './components/side-nav/side-nav.component';
import { WrapperComponent } from './components/wrapper/wrapper.component';
import { navigationBarReducerProvider } from './reducers/navigation-bar.reducer';

@NgModule({
  declarations: [ShellComponent, SideNavComponent, WrapperComponent],
  imports: [RouterModule, MaterialImportsModule],
  exports: [ShellComponent, SideNavComponent],
  providers: []
})
export class NgssmShellModule {
  static forRoot(): ModuleWithProviders<NgssmShellModule> {
    return {
      ngModule: NgssmShellModule,
      providers: [navigationBarReducerProvider]
    };
  }
}
