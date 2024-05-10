import { FeatureStateReducer } from './feature-state.reducer';
import { NgssmRegisterFeatureStateAction, NgssmStoreActionType, NgssmUnregisterFeatureStateAction } from '../actions';
import { State } from '../state';

describe('FeatureStateReducer', () => {
  let reducer: FeatureStateReducer;
  let state: State;

  beforeEach(() => {
    reducer = new FeatureStateReducer();
    state = {
      intial: {
        description: 'something'
      }
    };
  });

  [NgssmStoreActionType.registerFeatureState, NgssmStoreActionType.unregisterFeatureState].forEach((actionType: string) => {
    it(`should process action of type '${actionType}'`, () => {
      expect(reducer.processedActions).toContain(actionType);
    });
  });

  it('should return input state when processing not valid action type', () => {
    const updatedState = reducer.updateState(state, { type: 'not-processed' });

    expect(updatedState).toBe(state);
  });

  it(`should add to the state the defined feature state when processing action of type '${NgssmStoreActionType.registerFeatureState}'`, () => {
    const action = new NgssmRegisterFeatureStateAction('my-state', { id: 'rrftg' });
    state = reducer.updateState(state, action);

    expect(state).toEqual({
      intial: {
        description: 'something'
      },
      'my-state': { id: 'rrftg' }
    });
  });

  it(`should remove from the state the defined feature state when processing action of type '${NgssmStoreActionType.unregisterFeatureState}'`, () => {
    state = {
      intial: {
        description: 'something'
      },
      'my-state': { id: 'rrftg' }
    };
    const action = new NgssmUnregisterFeatureStateAction('my-state');
    state = reducer.updateState(state, action);

    expect(state).toEqual({
      intial: {
        description: 'something'
      }
    });
  });
});
