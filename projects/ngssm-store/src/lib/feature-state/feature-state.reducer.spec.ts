import { State } from 'ngssm-store';

import { FeatureStateReducer } from './feature-state.reducer';

describe('FeatureStateReducer', () => {
  let reducer: FeatureStateReducer;
  let state: State;

  beforeEach(() => {
    reducer = new FeatureStateReducer();
    state = {};
  });

  [].forEach((actionType: string) => {
    it(`should process action of type '${actionType}'`, () => {
      expect(reducer.processedActions).toContain(actionType);
    });
  });

  it('should return input state when processing not valid action type', () => {
    const updatedState = reducer.updateState(state, { type: 'not-processed' });

    expect(updatedState).toBe(state);
  });
});
