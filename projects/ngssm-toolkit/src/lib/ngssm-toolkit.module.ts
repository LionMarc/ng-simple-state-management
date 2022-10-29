import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MaterialImportsModule } from './material';
import { NotFoundComponent } from './not-found.component';
import { ComponentOverlayDirective, EmptyOverlayComponent, MessageOverlayComponent } from './overlay';
import { FilePickerComponent } from './file-picker/file-picker.component';
import { FileSizePipe } from './file-picker/file-size.pipe';

@NgModule({
  declarations: [ComponentOverlayDirective, MessageOverlayComponent, EmptyOverlayComponent, NotFoundComponent, FilePickerComponent, FileSizePipe],
  imports: [RouterModule, MaterialImportsModule],
  exports: [ComponentOverlayDirective, FilePickerComponent]
})
export class NgssmToolkitModule {}
