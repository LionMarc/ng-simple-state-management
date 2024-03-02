import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';

import { provideNgssmMatDialogConfigs } from 'ngssm-toolkit';

import { ToolkitDemoActionType } from './actions';
import { DialogDemoComponent } from './components/dialog-demo/dialog-demo.component';

export const provideToolkitDemo = (): EnvironmentProviders => {
  return makeEnvironmentProviders([
    provideNgssmMatDialogConfigs({
      openingAction: ToolkitDemoActionType.openDialogDemo,
      closingActions: [ToolkitDemoActionType.closeDialogDemo],
      component: DialogDemoComponent,
      matDialogConfig: {
        disableClose: true,
        height: '400px',
        width: '60vw'
      }
    })
  ]);
};
