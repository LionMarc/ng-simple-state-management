import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MaterialImportsModule } from './material';
import { NotFoundComponent } from './not-found.component';
import { ComponentOverlayDirective, EmptyOverlayComponent, MessageOverlayComponent } from './overlay';

@NgModule({
  declarations: [ComponentOverlayDirective, MessageOverlayComponent, EmptyOverlayComponent, NotFoundComponent],
  imports: [RouterModule, MaterialImportsModule],
  exports: [ComponentOverlayDirective]
})
export class NgssmToolkitModule {}
