import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { MaterialImportsModule, NgssmToolkitModule } from 'ngssm-toolkit';

import { ToolkitRoutingModule } from './toolkit-routing.module';
import { ToolkitDemoComponent } from './components/toolkit-demo/toolkit-demo.component';

@NgModule({
  declarations: [ToolkitDemoComponent],
  imports: [ReactiveFormsModule, MaterialImportsModule, NgssmToolkitModule, ToolkitRoutingModule]
})
export class ToolkitModule {}
