import { TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';

import { StoreMock } from 'ngssm-store';

import { NgssmTreeActionType } from '../actions';
import { NGSSM_TREE_DATA_SERVICE, NodeData } from '../model';
import { TreeNodeLoadingEffect } from './tree-node-loading.effect';

const dataService = {
  treeType: 'Testing',
  load: (treeId: string, nodeId: string): Observable<NodeData[]> => {
    return of([]);
  }
};

describe('TreeNodeLoadingEffect', () => {
  let effect: TreeNodeLoadingEffect;
  let store: StoreMock;

  beforeEach(() => {
    store = new StoreMock({});
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
