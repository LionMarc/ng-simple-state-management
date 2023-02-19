import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NotFoundComponent } from 'ngssm-toolkit';

import { NgssmTreeDemoComponent } from './ngssm-tree-demo/ngssm-tree-demo.component';
import { TreeInitGuard } from './ngssm-tree-demo/tree-init.guard';
import { remoteDataDemoRoutes } from './remote-data-demo/public-api';

const routes: Routes = [
  {
    path: 'tree-demo',
    component: NgssmTreeDemoComponent,
    canActivate: [TreeInitGuard]
  },
  {
    path: 'remote-data-demo',
    children: remoteDataDemoRoutes
  },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
