import { TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';

import { NgssmTreeActionType } from '../actions';
import { TreeNodesSearchingEffect } from './tree-nodes-searching.effect';

describe('TreeNodesSearchingEffect', () => {
  let effect: TreeNodesSearchingEffect;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatDialogModule],
      providers: [TreeNodesSearchingEffect]
    });
    effect = TestBed.inject(TreeNodesSearchingEffect);
  });

  [
    NgssmTreeActionType.displaySearchDialog,
    NgssmTreeActionType.closeSearchDialog,
    NgssmTreeActionType.searchTreeNodes,
    NgssmTreeActionType.registerNodes,
    NgssmTreeActionType.registerPartialSearchResults
  ].forEach((actionType: string) => {
    it(`should process action of type '${actionType}'`, () => {
      expect(effect.processedActions).toContain(actionType);
    });
  });
});
