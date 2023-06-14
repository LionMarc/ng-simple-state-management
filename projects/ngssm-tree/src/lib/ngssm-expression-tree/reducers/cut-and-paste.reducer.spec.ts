import { State } from 'ngssm-store';

import { CutAndPasteReducer } from './cut-and-paste.reducer';
import { NgssmExpressionTreeStateSpecification } from '../state';
import { NgssmExpressionTreeActionType } from '../actions';

describe('CutAndPasteReducer', () => {
  let reducer: CutAndPasteReducer;
  let state: State;

  beforeEach(() => {
    reducer = new CutAndPasteReducer();
    state = {
      [NgssmExpressionTreeStateSpecification.featureStateKey]: NgssmExpressionTreeStateSpecification.initialState
    };
  });

  [
    NgssmExpressionTreeActionType.ngssmCutExpressionTreeNode,
    NgssmExpressionTreeActionType.ngssmCancelCutExpressionTreeNode,
    NgssmExpressionTreeActionType.ngssmPasteExpressionTreeNode
  ].forEach((actionType: string) => {
    it(`should process action of type '${actionType}'`, () => {
      expect(reducer.processedActions).toContain(actionType);
    });
  });

  it('should return input state when processing not valid action type', () => {
    const updatedState = reducer.updateState(state, { type: 'not-processed' });

    expect(updatedState).toBe(state);
  });
});
