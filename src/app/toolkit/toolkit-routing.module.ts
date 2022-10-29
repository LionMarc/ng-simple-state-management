import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ToolkitDemoComponent } from './components/toolkit-demo/toolkit-demo.component';

const routes: Routes = [
  {
    path: 'ngssm-toolkit',
    component: ToolkitDemoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ToolkitRoutingModule {}
