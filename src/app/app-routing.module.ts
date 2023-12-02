import { inject, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NotFoundComponent } from 'ngssm-toolkit';

import { NgssmExpressionTreeDemoComponent } from './ngssm-expression-tree-demo';
import { NgssmTreeDemoComponent } from './ngssm-tree-demo/ngssm-tree-demo/ngssm-tree-demo.component';
import { TreeInitGuard } from './ngssm-tree-demo/tree-init.guard';
import { remoteDataDemoRoutes } from './remote-data-demo/public-api';
import { toolkitRoutes } from './toolkit/public-api';
import { VisibilityDemoComponent } from './visibility-demo';
import { ngssmDataDemoRoutes } from './ngssm-data-demo/public-api';

const routes: Routes = [
  {
    path: 'tree-demo',
    component: NgssmTreeDemoComponent,
    canActivate: [() => inject(TreeInitGuard).canActivate()]
  },
  {
    path: 'expression-tree-demo',
    component: NgssmExpressionTreeDemoComponent
  },
  {
    path: 'remote-data-demo',
    children: remoteDataDemoRoutes
  },
  {
    path: 'ngssm-toolkit',
    children: toolkitRoutes
  },
  {
    path: 'visibility-demo',
    component: VisibilityDemoComponent
  },
  ...ngssmDataDemoRoutes,
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
