import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { MaterialImportsModule } from 'ngssm-toolkit';
import { NgssmAceEditorModule } from 'ngssm-ace-editor';

import { ShellDemoRoutingModule } from './shell-demo-routing.module';
import { NotificationsDemoComponent } from './components/notifications-demo/notifications-demo.component';

@NgModule({
  declarations: [NotificationsDemoComponent],
  imports: [ReactiveFormsModule, MaterialImportsModule, NgssmAceEditorModule, ShellDemoRoutingModule]
})
export class ShellDemoModule {}
