import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MaterialImportsModule } from './material';
import { NotFoundComponent } from './not-found.component';
import { ComponentOverlayDirective, EmptyOverlayComponent, MessageOverlayComponent } from './overlay';
import { ShellComponent } from './shell';

@NgModule({
  declarations: [ShellComponent, ComponentOverlayDirective, MessageOverlayComponent, EmptyOverlayComponent, NotFoundComponent],
  imports: [RouterModule, MaterialImportsModule],
  exports: [ShellComponent]
})
export class NgssmToolkitModule {}
