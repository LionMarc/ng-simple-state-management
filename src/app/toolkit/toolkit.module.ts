import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { MaterialImportsModule, NgssmRegexEditorToggleComponent, NgssmToolkitModule } from 'ngssm-toolkit';

import { ToolkitRoutingModule } from './toolkit-routing.module';
import { ToolkitDemoComponent } from './components/toolkit-demo/toolkit-demo.component';
import { OverlayDemoComponent } from './components/overlay-demo/overlay-demo.component';

@NgModule({
  declarations: [ToolkitDemoComponent, OverlayDemoComponent],
  imports: [ReactiveFormsModule, MaterialImportsModule, NgssmToolkitModule, ToolkitRoutingModule, NgssmRegexEditorToggleComponent]
})
export class ToolkitModule {}
