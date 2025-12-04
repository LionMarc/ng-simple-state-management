import { inject } from '@angular/core';
import { Routes } from '@angular/router';

import { NotFoundComponent } from 'ngssm-toolkit';

import { NgssmTreeDemoComponent } from './ngssm-tree-demo/ngssm-tree-demo/ngssm-tree-demo.component';
import { TreeInitGuard } from './ngssm-tree-demo/tree-init.guard';
import { remoteDataDemoRoutes } from './remote-data-demo/public-api';
import { toolkitRoutes } from './toolkit/public-api';
import { VisibilityDemoComponent } from './visibility-demo';
import { ngssmDataDemoRoutes } from './ngssm-data-demo/public-api';
import { todoRoutes } from './todo/todo.routes';
import { aceEditorDemoRoutes } from './ace-editor/ace-editor-demo.routes';
import { shellDemoRoutes } from './shell-demo/shell-demo.routes';
import { ngssmFeatureStateDemoRoutes } from './ngssm-feature-state-demo/public-api';

export const routes: Routes = [
  ...aceEditorDemoRoutes,
  {
    path: 'tree-demo',
    component: NgssmTreeDemoComponent,
    canActivate: [() => inject(TreeInitGuard).canActivate()]
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
  ...ngssmFeatureStateDemoRoutes,
  ...shellDemoRoutes,
  ...todoRoutes,
  { path: '**', component: NotFoundComponent }
];
