import { TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';

import { NgssmTreeActionType } from '../actions';
import { NGSSM_TREE_DATA_SERVICE, NodeData } from '../model';
import { TreeNodeLoadingEffect } from './tree-node-loading.effect';

const dataService = {
  treeType: 'Testing',
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  load: (treeId: string, nodeId: string): Observable<NodeData[]> => {
    return of([]);
  }
};

describe('TreeNodeLoadingEffect', () => {
  let effect: TreeNodeLoadingEffect;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [TreeNodeLoadingEffect, { provide: NGSSM_TREE_DATA_SERVICE, useValue: dataService, multi: true }]
    });
    effect = TestBed.inject(TreeNodeLoadingEffect);
  });

  [NgssmTreeActionType.expandNode, NgssmTreeActionType.selectNode].forEach((actionType: string) => {
    it(`should process action of type '${actionType}'`, () => {
      expect(effect.processedActions).toContain(actionType);
    });
  });
});
