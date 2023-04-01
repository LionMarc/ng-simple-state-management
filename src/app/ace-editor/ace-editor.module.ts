import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { MaterialImportsModule } from 'ngssm-toolkit';
import { NgssmAceEditorComponent } from 'ngssm-ace-editor';

import { AceEditorRoutingModule } from './ace-editor-routing.module';
import { AceEditorDemoComponent } from './components/ace-editor-demo/ace-editor-demo.component';

@NgModule({
  declarations: [AceEditorDemoComponent],
  imports: [ReactiveFormsModule, MaterialImportsModule, AceEditorRoutingModule, NgssmAceEditorComponent]
})
export class AceEditorModule {}
