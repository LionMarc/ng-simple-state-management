import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AceEditorDemoComponent } from './components/ace-editor-demo/ace-editor-demo.component';

const routes: Routes = [
  {
    path: 'ace-editor',
    component: AceEditorDemoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AceEditorRoutingModule {}
